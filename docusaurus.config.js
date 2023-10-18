// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

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

  onBrokenLinks: 'log', //'throw',
  onBrokenMarkdownLinks: 'log', //'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
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
          sidebarPath: require.resolve('./sidebars.js'),
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
          customCss: require.resolve('./src/css/custom.css'),
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
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          'bash',
          'elixir',
          'erlang',
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

module.exports = config;
