# VPN - Auto Proxy Change

A React-based Proxy Management Dashboard that simulates an automatic proxy rotation system. It features a modern UI, a database of 50+ mock proxies, and AI-powered security analysis using the Google Gemini API.

## Features

- **Auto-Rotation Engine**: Automatically selects a new proxy server every 5 minutes.
- **50+ Server Locations**: Mock database covering US, UK, Germany, Japan, Singapore, and more.
- **Gemini AI Integration**: Analyzes server location and encryption protocols to generate a security risk report.
- **Modern UI**: Built with Tailwind CSS, featuring glassmorphism and animated status indicators.
- **Visual Timer**: Countdown timer for the next server rotation.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **AI**: Google GenAI SDK (Gemini 2.5 Flash)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/moazzamsohail169-bit/vpn-auto-proxy.git
   cd vpn-auto-proxy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_API_KEY=your_google_api_key_here
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

## Note

This application is a **frontend simulation** and dashboard. Due to browser security restrictions (sandboxing), a web application cannot change the operating system's actual network proxy settings. This tool is designed to manage and display proxy configurations that can be used by an external VPN client or system settings.