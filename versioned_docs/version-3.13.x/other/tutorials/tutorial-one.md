---
title: Tutorial 1
description: First tutorial, the "Hello World"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Introduction

In this part of the tutorial we'll write two programs in C#; a
producer that sends a single message, and a consumer that receives
messages and prints them out.  We'll gloss over some of the detail in
the .NET client API, concentrating on this very simple thing just to get
started.  It's a "Hello World" of messaging.

In the diagram below, "P" is our producer and "C" is our consumer. The
box in the middle is a queue - a message buffer that RabbitMQ keeps
on behalf of the consumer.

<div class="diagram">
  <img src="/img/tutorials/python-one.png" alt="(P) -> [|||] -> (C)" height="60"/>
</div>

<Tabs groupId="programming-languages">
  <TabItem value="dotnet" label=".NET">
  :::note
  RabbitMQ speaks multiple protocols. This tutorial uses AMQP 0-9-1, which is an open,
  general-purpose protocol for messaging. There are a number of clients
  for RabbitMQ in [many different
  languages](http://rabbitmq.com/devtools.html). We'll
  use the .NET client provided by RabbitMQ.
  
  The client supports [.NET Core](https://www.microsoft.com/net/core) as
  well as .NET Framework 4.5.1+. This tutorial will use RabbitMQ .NET client 5.0 and
  .NET Core so you will ensure
  you have it [installed](https://www.microsoft.com/net/core) and in your PATH.
  
  You can also use the .NET Framework to complete this tutorial however the
  setup steps will be different.
  
  RabbitMQ .NET client 5.0 and later versions are distributed via [nuget](https://www.nuget.org/packages/RabbitMQ.Client).
  
  This tutorial assumes you are using powershell on Windows. On MacOS and Linux nearly
  any shell will work.
  :::
  </TabItem>

  <TabItem value="java" label="Java">
  :::note
  RabbitMQ speaks multiple protocols. This tutorial uses AMQP 0-9-1, which is an open,
  general-purpose protocol for messaging. There are a number of clients
  for RabbitMQ in [many different
  languages](https://rabbitmq.com/devtools.html). We'll
  use the Java client provided by RabbitMQ.
  
  Download the [client library](https://repo1.maven.org/maven2/com/rabbitmq/amqp-client/5.16.0/amqp-client-5.16.0.jar)
  and its dependencies ([SLF4J API](https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.7.36/slf4j-api-1.7.36.jar) and
        > [SLF4J Simple](https://repo1.maven.org/maven2/org/slf4j/slf4j-simple/1.7.36/slf4j-simple-1.7.36.jar)).
  Copy those files in your working directory, along the tutorials Java files.
  
  Please note SLF4J Simple is enough for tutorials but you should use a full-blown
  logging library like [Logback](https://logback.qos.ch/) in production.

  (The RabbitMQ Java client is also in the central Maven repository,
  with the groupId `com.rabbitmq` and the artifactId `amqp-client`.)
  :::
  </TabItem>

  <TabItem value="python" label="Python">
  :::note
  RabbitMQ speaks multiple protocols. This tutorial uses AMQP 0-9-1, which is an open,
  general-purpose protocol for messaging. There are a number of clients for RabbitMQ
  in [many different languages](../devtools.html).  In this tutorial
  series we're going to use [Pika 1.0.0](https://pika.readthedocs.org/en/stable/),
  which is the Python client recommended
  by the RabbitMQ team. To install it you can use the
  [`pip`](https://pip.pypa.io/en/stable/quickstart/) package management tool:
  
  ```bash
  python -m pip install pika --upgrade
  ```
  :::
  </TabItem>
</Tabs>

## Sending

<div class="diagram">
  <img src="/img/tutorials/sending.png" alt="(P) -> [|||]" height="100"/>
</div>

<Tabs groupId="programming-languages">
  <TabItem value="dotnet" label=".NET">
We'll call our message publisher (sender) `Send.cs` and our message consumer (receiver)
`Receive.cs`.  The publisher will connect to RabbitMQ, send a single message,
then exit.

In
[`Send.cs`](https://github.com/rabbitmq/rabbitmq-tutorials/blob/main/dotnet/Send/Send.cs),
we need to use some namespaces:

```csharp
using System.Text;
using RabbitMQ.Client;
```

then we can create a connection to the server:

```csharp
var factory = new ConnectionFactory &lcub; HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();
...
```

The connection abstracts the socket connection, and takes care of
protocol version negotiation and authentication and so on for us. Here
we connect to a RabbitMQ node on the local machine - hence the
_localhost_. If we wanted to connect to a node on a different
machine we'd simply specify its hostname or IP address here.

Next we create a channel, which is where most of the API for getting
things done resides.

To send, we must declare a queue for us to send to; then we can publish a message
to the queue:

```csharp
using System.Text;
using RabbitMQ.Client;

var factory = new ConnectionFactory &lcub; HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.QueueDeclare(queue: "hello",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

const string message = "Hello World!";
var body = Encoding.UTF8.GetBytes(message);

channel.BasicPublish(exchange: string.Empty,
                     routingKey: "hello",
                     basicProperties: null,
                     body: body);
Console.WriteLine($" [x] Sent &lcub;message}");

Console.WriteLine(" Press [enter] to exit.");
Console.ReadLine();
```

Declaring a queue is idempotent - it will only be created if it doesn't
exist already. The message content is a byte array, so you can encode
whatever you like there.

When the code above finishes running, the channel and the connection
will be disposed. That's it for our publisher.

[Here's the whole Send.cs
class](https://github.com/rabbitmq/rabbitmq-tutorials/blob/main/dotnet/Send/Send.cs).
  </TabItem>

  <TabItem value="java" label="Java">
We'll call our message publisher (sender) `Send` and our message consumer (receiver)
`Recv`.  The publisher will connect to RabbitMQ, send a single message,
then exit.

In
[`Send.java`](https://github.com/rabbitmq/rabbitmq-tutorials/blob/main/java/Send.java),
we need some classes imported:

```java
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;
```

Set up the class and name the queue:

```java
public class Send &lcub;
  private final static String QUEUE_NAME = "hello";
  public static void main(String[] argv) throws Exception &lcub;
      ...
  }
}
```

then we can create a connection to the server:

```java
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("localhost");
try (Connection connection = factory.newConnection();
     Channel channel = connection.createChannel()) &lcub;

}
```

The connection abstracts the socket connection, and takes care of
protocol version negotiation and authentication and so on for us. Here
we connect to a RabbitMQ node on the local machine - hence the
_localhost_. If we wanted to connect to a node on a different
machine we'd simply specify its hostname or IP address here.

Next we create a channel, which is where most of the API for getting
things done resides. Note we can use a try-with-resources statement
because both `Connection` and `Channel` implement `java.lang.AutoCloseable`.
This way we don't need to close them explicitly in our code.

To send, we must declare a queue for us to send to; then we can publish a message
to the queue, all of this in the try-with-resources statement:

```java
channel.queueDeclare(QUEUE_NAME, false, false, false, null);
String message = "Hello World!";
channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
System.out.println(" [x] Sent '" + message + "'");
```

Declaring a queue is idempotent - it will only be created if it doesn't
exist already. The message content is a byte array, so you can encode
whatever you like there.

[Here's the whole Send.java
class](https://github.com/rabbitmq/rabbitmq-tutorials/blob/main/java/Send.java).
  </TabItem>

  <TabItem value="python" label="Python">
Our first program `send.py` will send a single message to the queue.
The first thing we need to do is to establish a connection with
RabbitMQ server.

```python
#!/usr/bin/env python
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
```

We're connected now, to a broker on the local machine - hence the
_localhost_. If we wanted to connect to a broker on a different
machine we'd simply specify its name or IP address here.

Next, before sending we need to make sure the recipient queue
exists. If we send a message to non-existing location, RabbitMQ will
just drop the message. Let's create a _hello_ queue to which the message will
be delivered:

```python
channel.queue_declare(queue='hello')
```

At this point we're ready to send a message. Our first message will
just contain a string _Hello World!_ and we want to send it to our
_hello_ queue.

In RabbitMQ a message can never be sent directly to the queue, it always
needs to go through an _exchange_. But let's not get dragged down by the
details &#8210; you can read more about _exchanges_ in [the third part of this
tutorial](tutorial-three-python.html). All we need to know now is how to use a default exchange
identified by an empty string. This exchange is special &#8210; it
allows us to specify exactly to which queue the message should go.
The queue name needs to be specified in the `routing_key` parameter:

```python
channel.basic_publish(exchange='',
                      routing_key='hello',
                      body='Hello World!')
print(" [x] Sent 'Hello World!'")
```

Before exiting the program we need to make sure the network buffers
were flushed and our message was actually delivered to RabbitMQ. We
can do it by gently closing the connection.

```python
connection.close()
```
  </TabItem>
</Tabs>

:::tip
**Sending doesn't work!**

If this is your first time using RabbitMQ and you don't see the "Sent"
message then you may be left scratching your head wondering what could
be wrong. Maybe the broker was started without enough free disk space
(by default it needs at least 50 MB free) and is therefore refusing to
accept messages. Check the broker logfile to confirm and reduce the
limit if necessary. The <a
href="https://www.rabbitmq.com/configure.html#config-items">configuration
file documentation</a> will show you how to set <code>disk_free_limit</code>.
:::

## Receiving

As for the consumer, it is listening for messages from
RabbitMQ. So unlike the publisher which publishes a single message, we'll
keep the consumer running continuously to listen for messages and print them out.

<div class="diagram">
  <img src="/img/tutorials/receiving.png" alt="[|||] -> (C)" height="100"/>
</div>

<Tabs groupId="programming-languages">
  <TabItem value="dotnet" label=".NET">
The code (in [`Receive.cs`](https://github.com/rabbitmq/rabbitmq-tutorials/blob/main/dotnet/Receive/Receive.cs)) has almost the same `using` statements as `Send`:

```csharp
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
```

Setting up is the same as the publisher; we open a connection and a
channel, and declare the queue from which we're going to consume.
Note this matches up with the queue that `Send` publishes to.

```csharp
var factory = new ConnectionFactory &lcub; HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.QueueDeclare(queue: "hello",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);
...
```

Note that we declare the queue here as well. Because we might start
the consumer before the publisher, we want to make sure the queue exists
before we try to consume messages from it.

We're about to tell the server to deliver us the messages from the
queue. Since it will push us messages asynchronously, we provide a
callback. That is what `EventingBasicConsumer.Received` event handler
does.

```csharp
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

var factory = new ConnectionFactory &lcub; HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.QueueDeclare(queue: "hello",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

Console.WriteLine(" [*] Waiting for messages.");

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) =>
&lcub;
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    Console.WriteLine($" [x] Received &lcub;message}");
};
channel.BasicConsume(queue: "hello",
                     autoAck: true,
                     consumer: consumer);

Console.WriteLine(" Press [enter] to exit.");
Console.ReadLine();
```

[Here's the whole Receive.cs
class](https://github.com/rabbitmq/rabbitmq-tutorials/blob/main/dotnet/Receive/Receive.cs).
  </TabItem>

  <TabItem value="java" label="Java">
The code (in [`Recv.java`](https://github.com/rabbitmq/rabbitmq-tutorials/blob/main/java/Recv.java)) has almost the same imports as `Send`:

```java
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
```

The extra `DeliverCallback` interface we'll use to buffer the messages pushed to us by the server.

Setting up is the same as the publisher; we open a connection and a
channel, and declare the queue from which we're going to consume.
Note this matches up with the queue that `send` publishes to.

```java
public class Recv &lcub;

  private final static String QUEUE_NAME = "hello";

  public static void main(String[] argv) throws Exception &lcub;
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    Connection connection = factory.newConnection();
    Channel channel = connection.createChannel();

    channel.queueDeclare(QUEUE_NAME, false, false, false, null);
    System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

  }
}

```

Note that we declare the queue here, as well. Because we might start
the consumer before the publisher, we want to make sure the queue exists
before we try to consume messages from it.

Why don't we use a try-with-resource statement to automatically close
the channel and the connection? By doing so we would simply make the program
move on, close everything, and exit! This would be awkward because
we want the process to stay alive while the consumer is listening
asynchronously for messages to arrive.

We're about to tell the server to deliver us the messages from the
queue. Since it will push us messages asynchronously, we provide a
callback in the form of an object that will buffer the messages until
we're ready to use them. That is what a `DeliverCallback` subclass does.

```java
DeliverCallback deliverCallback = (consumerTag, delivery) -> &lcub;
    String message = new String(delivery.getBody(), "UTF-8");
    System.out.println(" [x] Received '" + message + "'");
};
channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> &lcub; });
```

[Here's the whole Recv.java
class](https://github.com/rabbitmq/rabbitmq-tutorials/blob/main/java/Recv.java).
  </TabItem>

  <TabItem value="python" label="Python">
Our second program `receive.py` will receive messages from the queue and print
them on the screen.

Again, first we need to connect to RabbitMQ server. The code
responsible for connecting to Rabbit is the same as previously.

The next step, just like before, is to make sure that the queue
exists. Creating a queue using `queue_declare` is idempotent &#8210; we
can run the command as many times as we like, and only one will be
created.

```python
channel.queue_declare(queue='hello')
```

You may ask why we declare the queue again &#8210; we have already declared it
in our previous code. We could avoid that if we were sure
that the queue already exists. For example if `send.py` program was
run before. But we're not yet sure which
program to run first. In such cases it's a good practice to repeat
declaring the queue in both programs.

:::tip
**Listing queues**

You may wish to see what queues RabbitMQ has and how many
messages are in them. You can do it (as a privileged user) using the `rabbitmqctl` tool:

```bash
sudo rabbitmqctl list_queues
```

On Windows, omit the sudo:
```powershell
rabbitmqctl.bat list_queues
```
:::

Receiving messages from the queue is more complex. It works by subscribing
a `callback` function to a queue. Whenever we receive
a message, this `callback` function is called by the Pika library.
In our case this function will print on the screen the contents of
the message.

```python
def callback(ch, method, properties, body):
    print(f" [x] Received &lcub;body}")
```

Next, we need to tell RabbitMQ that this particular callback function should
receive messages from our _hello_ queue:

```python
channel.basic_consume(queue='hello',
                      auto_ack=True,
                      on_message_callback=callback)
```

For that command to succeed we must be sure that a queue which we want
to subscribe to exists. Fortunately we're confident about that &#8210; we've
created a queue above &#8210; using `queue_declare`.

The `auto_ack` parameter will be described [later on](tutorial-two-python.html).

And finally, we enter a never-ending loop that waits for data and runs callbacks
whenever necessary, and catch `KeyboardInterrupt` during program shutdown.

```python
print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
```

```python
if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
```
  </TabItem>
</Tabs>
