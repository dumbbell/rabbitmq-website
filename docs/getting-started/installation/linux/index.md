---
title: Linux
sidebar_position: 1
description: >
  Installing RabbitMQ on Linux
---

Most RabbitMQ distributions ship with RabbitMQ. Therefore, you can use your package manage to install it.

For example, on Arch Linux, you can run

```
sudo pacman -S rabbitmq
```

Unfortunately, most distribution ship an old RabbitMQ version. For exaple, Debian 12 released in June 2023,
ships with RabbitMQ 3.10.8, released in July 2022. At the time Debin 12 was shipped, RabbitMQ 3.12 was already
available and 3.10 series was approaching the end of community support.

To make it easy to use an up to date (supported!) RabbitMQ version, we ship RPM and DEB packages for the most
popular distributions. Read on for more details.
