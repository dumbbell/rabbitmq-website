import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useActiveVersion } from '@docusaurus/plugin-content-docs/client';

function getActualVersion() {
  const {
    siteConfig: {
      customFields: {versionPerBranch},
    },
  } = useDocusaurusContext();

  const branch = useActiveVersion().label;
  const version = versionPerBranch[branch];
  return version;
}

export function RabbitMQServerVersion() {
  const version = getActualVersion();
  return version;
}

export function RabbitMQServerPackageURL({ packageType }) {
  const version = getActualVersion();
  const baseUrl = `https://github.com/rabbitmq/rabbitmq-server/releases/download/v${version}`;
  switch (packageType) {
    case 'generic-unix':
      return `${baseUrl}/rabbitmq-server-generic-unix-${version}.tar.xz`;
    default:
      throw new Error(`Unknown RabbitMQ server package type ${package_type}`);
  }
}

export function RabbitMQServerPackageLink({ children, ...props }) {
  const url = RabbitMQServerPackageURL(props);
  return <a href={url}>{children}</a>;
}

export function RabbitMQServerPackageFilename({ asCode, ...props }) {
  const url = RabbitMQServerPackageURL(props);
  const basename = url.split('/').reverse()[0];
  if (asCode == null || asCode) {
    return <code>{basename}</code>;
  } else {
    return basename;
  }
}

export function RabbitMQServerPackageGenUnixDir({ asCode }) {
  const version = getActualVersion();
  const dir = `rabbitmq_${version}`;
  if (asCode == null || asCode) {
    return <code>{dir}</code>;
  } else {
    return dir;
  }
}
