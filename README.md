# LashedByLiyah - Premium Lash Supply Boutique

## Project Overview
LashedByLiyah is a professional e-commerce Single Page Application (SPA) built for lash artists. Originally a service-based business, this platform now serves as a premium supply boutique for professional-grade lash tools and essentials.

## Technical Stack
- **Frontend:** React.js with Vite
- **Routing:** React Router DOM (SPA Architecture)
- **Database:** Supabase (BaaS)
- **Styling:** Custom CSS with a "Minimalist Edgy" aesthetic (Cheetah print/Blue/Black theme)

## Features (CRUD Integration)
- **Product Display:** Real-time inventory fetching from Supabase.
- **Admin Dashboard:** Full CRUD capabilities allowing the administrator to Add and Delete products from the live database.
- **Responsive Design:** Optimized for both desktop and mobile use.

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to launch the local development server.
4. Database connection managed via `supabaseClient.js`.

## Reflection
This project showcases the migration from a static HTML site to a dynamic React application. By integrating Supabase, I implemented a real-time data layer that allows for seamless inventory management.