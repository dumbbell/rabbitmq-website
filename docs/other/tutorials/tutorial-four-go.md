<!--
Copyright (c) 2007-2023 VMware, Inc. or its affiliates.

All rights reserved. This program and the accompanying materials
are made available under the terms of the under the Apache License,
Version 2.0 (the "License”); you may not use this file except in compliance
with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
# RabbitMQ tutorial - Routing SUPPRESS-RHS

## Routing
### (using the Go RabbitMQ client)

<xi:include href="site/tutorials/tutorials-help.xml.inc"/>

In the [previous tutorial](tutorial-three-go.html) we built a
simple logging system. We were able to broadcast log messages to many
receivers.

In this tutorial we're going to add a feature to it - we're going to
make it possible to subscribe only to a subset of the messages. For
example, we will be able to direct only critical error messages to the
log file (to save disk space), while still being able to print all of
the log messages on the console.


Bindings
--------

In previous examples we were already creating bindings. You may recall
code like:

```go
err = ch.QueueBind(
  q.Name, // queue name
  "",     // routing key
  "logs", // exchange
  false,
  nil)
```

A binding is a relationship between an exchange and a queue. This can
be simply read as: the queue is interested in messages from this
exchange.

Bindings can take an extra `routing_key` parameter. To avoid the
confusion with a `Channel.Publish` parameter we're going to call it a
`binding key`. This is how we could create a binding with a key:

```go
err = ch.QueueBind(
  q.Name,    // queue name
  "black",   // routing key
  "logs",    // exchange
  false,
  nil)
```

The meaning of a binding key depends on the exchange type. The
`fanout` exchanges, which we used previously, simply ignored its
value.

Direct exchange
---------------

Our logging system from the previous tutorial broadcasts all messages
to all consumers. We want to extend that to allow filtering messages
based on their severity. For example we may want the script which is
writing log messages to the disk to only receive critical errors, and
not waste disk space on warning or info log messages.

We were using a `fanout` exchange, which doesn't give us much
flexibility - it's only capable of mindless broadcasting.

We will use a `direct` exchange instead. The routing algorithm behind
a `direct` exchange is simple - a message goes to the queues whose
`binding key` exactly matches the `routing key` of the message.

To illustrate that, consider the following setup:

<div class="diagram">
  <img src="../img/tutorials/direct-exchange.png" height="170" alt="Direct exchange routing" />
  <div class="diagram_source">
    digraph digraph &lcub;
      bgcolor=transparent;
      truecolor=true;
      rankdir=LR;
      node [style="filled"];
      //
      P [label="P", fillcolor="#00ffff"];
      subgraph cluster_X1 &lcub;
        label="type=direct";
	color=transparent;
        X [label="X", fillcolor="#3333CC"];
      };
      subgraph cluster_Q1 &lcub;
        label="Q1";
	color=transparent;
        Q1 [label="&lcub;||||}", fillcolor="red", shape="record"];
      };
      subgraph cluster_Q2 &lcub;
        label="Q2";
	color=transparent;
        Q2 [label="&lcub;||||}", fillcolor="red", shape="record"];
      };
      C1 [label=&lt;C&lt;font point-size="7"&gt;1&lt;/font&gt;&gt;, fillcolor="#33ccff"];
      C2 [label=&lt;C&lt;font point-size="7"&gt;2&lt;/font&gt;&gt;, fillcolor="#33ccff"];
      //
      P -&gt; X;
      X -&gt; Q1 [label="orange"];
      X -&gt; Q2 [label="black"];
      X -&gt; Q2 [label="green"];
      Q1 -&gt; C1;
      Q2 -&gt; C2;
    }
  </div>
</div>

In this setup, we can see the `direct` exchange `X` with two queues bound
to it. The first queue is bound with binding key `orange`, and the second
has two bindings, one with binding key `black` and the other one
with `green`.

In such a setup a message published to the exchange with a routing key
`orange` will be routed to queue `Q1`. Messages with a routing key of `black`
or `green` will go to `Q2`. All other messages will be discarded.


Multiple bindings
-----------------
<div class="diagram">
  <img src="../img/tutorials/direct-exchange-multiple.png" height="170" alt="Multiple Bindings" />
  <div class="diagram_source">
    digraph digraph &lcub;
      bgcolor=transparent;
      truecolor=true;
      rankdir=LR;
      node [style="filled"];
      //
      P [label="P", fillcolor="#00ffff"];
      subgraph cluster_X1 &lcub;
        label="type=direct";
	color=transparent;
        X [label="X", fillcolor="#3333CC"];
      };
      subgraph cluster_Q1 &lcub;
        label="Q1";
	color=transparent;
        Q1 [label="&lcub;||||}", fillcolor="red", shape="record"];
      };
      subgraph cluster_Q2 &lcub;
        label="Q2";
	color=transparent;
        Q2 [label="&lcub;||||}", fillcolor="red", shape="record"];
      };
      C1 [label=&lt;C&lt;font point-size="7"&gt;1&lt;/font&gt;&gt;, fillcolor="#33ccff"];
      C2 [label=&lt;C&lt;font point-size="7"&gt;2&lt;/font&gt;&gt;, fillcolor="#33ccff"];
      //
      P -&gt; X;
      X -&gt; Q1 [label="black"];
      X -&gt; Q2 [label="black"];
      Q1 -&gt; C1;
      Q2 -&gt; C2;
    }
  </div>
</div>

It is perfectly legal to bind multiple queues with the same binding
key. In our example we could add a binding between `X` and `Q1` with
binding key `black`. In that case, the `direct` exchange will behave
like `fanout` and will broadcast the message to all the matching
queues. A message with routing key `black` will be delivered to both
`Q1` and `Q2`.


Emitting logs
-------------

We'll use this model for our logging system. Instead of `fanout` we'll
send messages to a `direct` exchange. We will supply the log severity as
a `routing key`. That way the receiving script will be able to select
the severity it wants to receive. Let's focus on emitting logs
first.

As always, we need to create an exchange first:

```go
err = ch.ExchangeDeclare(
  "logs_direct", // name
  "direct",      // type
  true,          // durable
  false,         // auto-deleted
  false,         // internal
  false,         // no-wait
  nil,           // arguments
)
```

And we're ready to send a message:

```go
err = ch.ExchangeDeclare(
  "logs_direct", // name
  "direct",      // type
  true,          // durable
  false,         // auto-deleted
  false,         // internal
  false,         // no-wait
  nil,           // arguments
)
failOnError(err, "Failed to declare an exchange")

ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

body := bodyFrom(os.Args)
err = ch.PublishWithContext(ctx,
  "logs_direct",         // exchange
  severityFrom(os.Args), // routing key
  false, // mandatory
  false, // immediate
  amqp.Publishing&lcub;
    ContentType: "text/plain",
    Body:        []byte(body),
})
```

To simplify things we will assume that 'severity' can be one of
'info', 'warning', 'error'.


Subscribing
-----------

Receiving messages will work just like in the previous tutorial, with
one exception - we're going to create a new binding for each severity
we're interested in.

```go
q, err := ch.QueueDeclare(
  "",    // name
  false, // durable
  false, // delete when unused
  true,  // exclusive
  false, // no-wait
  nil,   // arguments
)
failOnError(err, "Failed to declare a queue")

if len(os.Args) &lt; 2 &lcub;
  log.Printf("Usage: %s [info] [warning] [error]", os.Args[0])
  os.Exit(0)
}
for _, s := range os.Args[1:] &lcub;
  log.Printf("Binding queue %s to exchange %s with routing key %s",
     q.Name, "logs_direct", s)
  err = ch.QueueBind(
    q.Name,        // queue name
    s,             // routing key
    "logs_direct", // exchange
    false,
    nil)
  failOnError(err, "Failed to bind a queue")
}
```

Putting it all together
-----------------------

<div class="diagram">
  <img src="../img/tutorials/python-four.png" height="170" alt="Final routing: putting it all together." />
  <div class="diagram_source">
    digraph digraph &lcub;
      bgcolor=transparent;
      truecolor=true;
      rankdir=LR;
      node [style="filled"];
      //
      P [label="P", fillcolor="#00ffff"];
      subgraph cluster_X1 &lcub;
        label="type=direct";
	color=transparent;
        X [label="X", fillcolor="#3333CC"];
      };
      subgraph cluster_Q2 &lcub;
        label="amqp.gen-S9b...";
	color=transparent;
        Q2 [label="&lcub;||||}", fillcolor="red", shape="record"];
      };
      subgraph cluster_Q1 &lcub;
        label="amqp.gen-Ag1...";
	color=transparent;
        Q1 [label="&lcub;||||}", fillcolor="red", shape="record"];
      };
      C1 [label=&lt;C&lt;font point-size="7"&gt;1&lt;/font&gt;&gt;, fillcolor="#33ccff"];
      C2 [label=&lt;C&lt;font point-size="7"&gt;2&lt;/font&gt;&gt;, fillcolor="#33ccff"];
      //
      P -&gt; X;
      X -&gt; Q1 [label="info"];
      X -&gt; Q1 [label="error"];
      X -&gt; Q1 [label="warning"];
      X -&gt; Q2 [label="error"];
      Q1 -&gt; C2;
      Q2 -&gt; C1;
    }
  </div>
</div>


The code for `emit_log_direct.go` script:

```go
package main

import (
        "context"
        "log"
        "os"
        "strings"
        "time"

        amqp "github.com/rabbitmq/amqp091-go"
)

func failOnError(err error, msg string) &lcub;
        if err != nil &lcub;
                log.Panicf("%s: %s", msg, err)
        }
}

func main() &lcub;
        conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
        failOnError(err, "Failed to connect to RabbitMQ")
        defer conn.Close()

        ch, err := conn.Channel()
        failOnError(err, "Failed to open a channel")
        defer ch.Close()

        err = ch.ExchangeDeclare(
                "logs_direct", // name
                "direct",      // type
                true,          // durable
                false,         // auto-deleted
                false,         // internal
                false,         // no-wait
                nil,           // arguments
        )
        failOnError(err, "Failed to declare an exchange")

        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()

        body := bodyFrom(os.Args)
	    err = ch.PublishWithContext(ctx,
                "logs_direct",         // exchange
                severityFrom(os.Args), // routing key
                false, // mandatory
                false, // immediate
                amqp.Publishing&lcub;
                        ContentType: "text/plain",
                        Body:        []byte(body),
                })
        failOnError(err, "Failed to publish a message")

        log.Printf(" [x] Sent %s", body)
}

func bodyFrom(args []string) string &lcub;
        var s string
        if (len(args) &lt; 3) || os.Args[2] == "" &lcub;
                s = "hello"
        } else &lcub;
                s = strings.Join(args[2:], " ")
        }
        return s
}

func severityFrom(args []string) string &lcub;
        var s string
        if (len(args) &lt; 2) || os.Args[1] == "" &lcub;
                s = "info"
        } else &lcub;
                s = os.Args[1]
        }
        return s
}
```

The code for `receive_logs_direct.go`:

```go
package main

import (
        "log"
        "os"

        amqp "github.com/rabbitmq/amqp091-go"
)

func failOnError(err error, msg string) &lcub;
        if err != nil &lcub;
                log.Panicf("%s: %s", msg, err)
        }
}

func main() &lcub;
        conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
        failOnError(err, "Failed to connect to RabbitMQ")
        defer conn.Close()

        ch, err := conn.Channel()
        failOnError(err, "Failed to open a channel")
        defer ch.Close()

        err = ch.ExchangeDeclare(
                "logs_direct", // name
                "direct",      // type
                true,          // durable
                false,         // auto-deleted
                false,         // internal
                false,         // no-wait
                nil,           // arguments
        )
        failOnError(err, "Failed to declare an exchange")

        q, err := ch.QueueDeclare(
                "",    // name
                false, // durable
                false, // delete when unused
                true,  // exclusive
                false, // no-wait
                nil,   // arguments
        )
        failOnError(err, "Failed to declare a queue")

        if len(os.Args) &lt; 2 &lcub;
                log.Printf("Usage: %s [info] [warning] [error]", os.Args[0])
                os.Exit(0)
        }
        for _, s := range os.Args[1:] &lcub;
                log.Printf("Binding queue %s to exchange %s with routing key %s",
                        q.Name, "logs_direct", s)
                err = ch.QueueBind(
                        q.Name,        // queue name
                        s,             // routing key
                        "logs_direct", // exchange
                        false,
                        nil)
                failOnError(err, "Failed to bind a queue")
        }

        msgs, err := ch.Consume(
                q.Name, // queue
                "",     // consumer
                true,   // auto ack
                false,  // exclusive
                false,  // no local
                false,  // no wait
                nil,    // args
        )
        failOnError(err, "Failed to register a consumer")

        var forever chan struct&lcub;}

        go func() &lcub;
                for d := range msgs &lcub;
                        log.Printf(" [x] %s", d.Body)
                }
        }()

        log.Printf(" [*] Waiting for logs. To exit press CTRL+C")
        &lt;-forever
}
```

If you want to save only 'warning' and 'error' (and not 'info') log
messages to a file, just open a console and type:

```bash
go run receive_logs_direct.go warning error > logs_from_rabbit.log
```

If you'd like to see all the log messages on your screen, open a new
terminal and do:

```bash
go run receive_logs_direct.go info warning error
# => [*] Waiting for logs. To exit press CTRL+C
```

And, for example, to emit an `error` log message just type:

```bash
go run emit_log_direct.go error "Run. Run. Or it will explode."
# => [x] Sent 'error':'Run. Run. Or it will explode.'
```

(Full source code for [(emit_log_direct.go source)](https://github.com/rabbitmq/rabbitmq-tutorials/blob/main/go/emit_log_direct.go)
and [(receive_logs_direct.go source)](https://github.com/rabbitmq/rabbitmq-tutorials/blob/main/go/receive_logs_direct.go))

Move on to [tutorial 5](tutorial-five-go.html) to find out how to listen
for messages based on a pattern.

