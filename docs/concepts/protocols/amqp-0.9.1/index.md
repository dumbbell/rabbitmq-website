---
title: AMQP 0.9.1
description: AMQP 0.9.1 - the most popular protocol for RabbitMQ
date: 2023-08-25
weight: 40
---

## <a id="amqp-091" class="anchor" href="#amqp-091">AMQP 0-9-1 and extensions</a>

RabbitMQ was originally developed to [support AMQP 0-9-1](./protocol.html).
As such this protocol is the "core" protocol supported by
the broker. All of these variants are fairly similar to each other,
with later versions tidying up unclear or unhelpful parts of earlier
versions. We have [extended](./extensions.html) AMQP 0-9-1
in various ways.

AMQP 0-9-1 is a binary protocol, and defines quite strong
messaging semantics. For clients it's a reasonably easy
protocol to implement, and as such there
are [a large number of client libraries](./devtools.html) available for
many different programming languages and environments.

AMQP 0-9-1 is the protocol used by [RabbitMQ tutorials](./getstarted.html).
