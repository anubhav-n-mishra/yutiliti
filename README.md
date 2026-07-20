# yutility

yutility is a premium, high performance client side utility toolkit designed for developers, creators, and professionals. It provides a comprehensive suite of instant use tools that run entirely in your web browser. 

By operating 100 percent locally on the client side, yutility ensures zero latency and maximum privacy. No files or data are ever uploaded to an external server.

## Features and Architecture

* **Absolute Privacy**: All operations, including image processing, document parsing, and data generation, happen securely within your local browser environment.
* **Instant Execution**: Without the need for server roundtrips, tools perform complex calculations and file modifications instantly.
* **Modern Interface**: Designed with a clean, distraction free, and highly responsive user interface.
* **No Dependencies on Cloud Processing**: Built using native browser APIs and highly optimized WebAssembly models.

## Available Tools

yutility currently features a massive library of 27 tools categorized into distinct workflows:

### Developer and Design Tools
* **Password Generator**: Create cryptographically secure keys.
* **JSON Formatter**: Validate and prettify JSON structures.
* **QR Code Generator**: Encode text and links instantly.
* **Fake Data Generator**: Generate mock SQL, JSON, and CSV data sets.
* **Color Palette Generator**: Find harmonious colors and verify Web Content Accessibility Guidelines contrast ratios.
* **Favicon Generator**: Create standard web icon packages.
* **Open Graph Image Generator**: Design high quality social media preview cards.

### Media and Utility Tools
* **AI Background Remover**: Isolate subjects using local machine learning.
* **Meme Maker**: Add classic impact font text to images.
* **Social Media Resizer**: Crop and format images for all major platforms.
* **Photo Collage Maker**: Arrange multiple images into grids and layouts.
* **Image Format Converter**: Convert images between PNG, JPEG, and WebP natively.
* **Image Resizer**: Adjust image dimensions securely.
* **Image Compressor**: Reduce file sizes without losing visual quality.
* **ZIP File Extractor**: Preview and extract archives natively in the browser.
* **Universal Unit Converter**: Quickly switch between standard measurements.
* **Word and Character Counter**: Analyze text for density and reading time.
* **Age Calculator**: Find precise chronological measurements.

### PDF Suite
* **PDF Merger**: Combine multiple documents.
* **PDF Splitter**: Extract specific pages.
* **PDF Compressor**: Optimize PDF streams.
* **PDF Watermarker**: Stamp custom text on your pages.
* **PDF Metadata Editor**: Modify hidden document properties.
* **Image to PDF**: Compile images into a single document.

### Financial Calculators
* **EMI Calculator**: Generate exact amortization schedules.
* **SIP Investment Calculator**: Forecast compound wealth growth.
* **Salary Calculator**: Estimate take home pay and tax deductions.

## Technical Stack

yutility is built upon modern web technologies to guarantee speed and reliability:
* Framework: Next.js and React
* Styling: Tailwind CSS
* Icons: Lucide React
* Processing: Standard JavaScript and WebAssembly

## Local Development Setup

To run yutility on your local machine, follow these steps:

1. Clone the repository to your local system.
2. Ensure you have Node installed.
3. Open your terminal in the project directory.
4. Install the required dependencies:
   ```bash
   npm install
   ```
5. Start the local development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000`.

## Contribution Guidelines

Contributions are welcome. If you have an idea for a new client side tool or an improvement to an existing one, please fork the repository and submit a pull request. Ensure that all new tools strictly adhere to the client side only architecture rule. No server side application programming interfaces should be introduced.

## License

This project is proprietary. All rights reserved by yutility, owned by amvelt.com and the yutility team.
