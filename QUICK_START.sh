#!/bin/bash

# Quick Start Script for Local Development
# This script helps you set up the project locally

echo "🚀 AI Website Builder - Local Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if PostgreSQL is running
if command -v pg_isready &> /dev/null; then
    if pg_isready -q; then
        echo "✅ PostgreSQL is running"
    else
        echo "⚠️  PostgreSQL might not be running. Make sure it's started."
    fi
else
    echo "⚠️  Could not check PostgreSQL status. Make sure it's installed and running."
fi
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Please edit .env file with your actual values:"
    echo "   - DATABASE_URL (your PostgreSQL connection string)"
    echo "   - AUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "   - OPENAI_API_KEY (your OpenAI API key)"
    echo ""
    read -p "Press Enter after you've edited .env file..."
else
    echo "✅ .env file already exists"
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

# Push database schema
echo "🗄️  Setting up database schema..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Failed to push database schema"
    echo "   Make sure PostgreSQL is running and DATABASE_URL is correct"
    exit 1
fi

echo "✅ Database schema created"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "   npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
