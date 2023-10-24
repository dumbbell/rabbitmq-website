// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'RabbitMQ',
  tagline: 'RabbitMQ: easy to use, flexible messaging and streaming',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://rabbitmq-website.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dumbbell', // Usually your GitHub org/user name.
  projectName: 'rabbitmq-website', // Usually your repo name.

  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    versionPerBranch: {
      'Next': '4.0.0-alpha.1',
      '3.13.x': '3.13.0-beta.6'
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dumbbell/rabbitmq-website/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dumbbell/rabbitmq-website/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        //title: 'RabbitMQ',
        logo: {
          alt: 'RabbitMQ',
          src: 'img/logo-rabbitmq.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownItemsAfter: [{to: '/versions', label: 'All versions'}],
            dropdownActiveClassDisabled: true,
          },
          {
            href: 'https://github.com/dumbbell/rabbitmq-website',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting started',
                to: '/docs/getting-started',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://rabbitmq.com/discord/',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/RabbitMQ',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/dumbbell/rabbitmq-website',
              },
            ],
          },
        ],
        copyright: `Copyright © 2007-${new Date().getFullYear()} VMware, Inc. or its affiliates.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          'bash',
          'csharp',
          'elixir',
          'erlang',
          'go',
          'java',
          'json',
          'php',
          'powershell',
          'python',
          'shell-session',
        ],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'WIFC6XVFQT',

        // Public API key: it is safe to commit it
        apiKey: 'aa131747d777a520d27ac67e8a79694f',

        indexName: 'rabbitmq-webnetlify',

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to
        // disable it)
        searchPagePath: 'search',
      },
    }),
};

export default config;
