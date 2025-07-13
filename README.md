# Vyoniq

[![Deployed with Coolify](https://img.shields.io/badge/Deployed%20with-Coolify-blue?style=for-the-badge&logo=docker)](https://coolify.io/)

> Innovate Faster with AI-Powered Software Solutions

Vyoniq is a modern Software Development company powered by AI agents, delivering innovative solutions with the efficiency of a large team. We specialize in Web and Mobile App Development, secure Hosting Services, and cutting-edge AI Integrations.

This repository contains the source code for the official Vyoniq landing page.

## ✨ Features

- **Core Services:** A comprehensive showcase of our offerings:
  - **Web and Mobile App Development:** Scalable, custom applications built with AI-optimized workflows.
  - **Hosting Services:** Secure, high-performance, and reliable hosting solutions.
  - **AI Integrations:** Enhance your applications and business processes with intelligent features.
- **Custom Apps Development:** We create tailored applications to meet your specific needs, powered by AI and MCP servers.
- **Lead Generation:** A fully functional contact form to handle client inquiries and project requests.
- **Newsletter System:** A comprehensive newsletter system to keep users updated with the latest developments and insights.
- **Modern Tech Stack:** A responsive, accessible, and performant landing page built for an excellent user experience.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Deployment:** [Coolify](https://coolify.io/) on a custom VPS

## 🛠️ Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or later)
- [pnpm](https://pnpm.io/installation) (or `npm`/`yarn`)

### Installation

1.  **Clone the repository:**

    \`\`\`sh
    git clone https://github.com/JaviGong/vyoniq.git
    cd vyoniq
    \`\`\`

2.  **Install dependencies:**

    \`\`\`sh
    pnpm install
    \`\`\`

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project. You can copy the `.env.example` file to get started:

    \`\`\`sh
    cp .env.example .env.local
    \`\`\`

    You will need to add your credentials for [Clerk](https://clerk.com/) and connect to your [PostgreSQL](https://www.postgresql.org/) instance.

4.  **Run the development server:**

    \`\`\`sh
    pnpm dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🚢 Deployment

This project is configured for deployment on a custom VPS managed by [Coolify](https://coolify.io/). Coolify monitors the `main` branch of this repository and automatically triggers a new deployment upon detecting a push.

The deployment pipeline handles building the Next.js application, setting up the necessary services, and running the application in a production environment. For more details on the deployment setup, refer to the Coolify instance managing this project.
