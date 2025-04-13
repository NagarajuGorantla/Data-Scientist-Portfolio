require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "cdn.jsdelivr.net", "unpkg.com", "cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "unpkg.com", "cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "cdnjs.cloudflare.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Compression
app.use(compression());

// Static files with caching
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Nodemailer verification error:', error);
    } else {
        console.log('Nodemailer is ready to send emails');
    }
});

console.log('Email configuration:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER ? 'configured' : 'not configured'
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
    console.log('Contact form submission received');
    const { name, email, message } = req.body;

    // Input validation
    if (!name || !email || !message) {
        console.log('Validation failed:', { name, email, message });
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        console.log('Invalid email format:', email);
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        console.log('Sending email...');
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to send email',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log('Press Ctrl+C to stop the server');
}); 