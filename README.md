# Data Scientist Portfolio Website

A modern, responsive portfolio website for data scientists built with HTML, CSS (Bootstrap), and JavaScript.

## Features

- Responsive design that works on all devices
- Modern and clean UI with smooth animations
- Sections for Projects, Skills, Resume, Blog, and Contact
- SEO optimized
- Google Analytics integration
- Contact form functionality
- Smooth scrolling and scroll animations

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Customize the content:
- Update `index.html` with your personal information
- Add your projects to the Projects section
- Update the Skills section with your expertise
- Add your education and work experience to the Resume section
- Customize the contact information
- Add your Google Analytics tracking ID in `js/main.js`

3. Add your images:
- Place your profile picture in `images/profile.jpg`
- Add project images in the `images` folder
- Add blog post images in the `images` folder

## Deployment

The website can be deployed on various platforms:

### GitHub Pages
1. Create a new repository on GitHub
2. Push your code to the repository
3. Go to Settings > Pages
4. Select the main branch as the source
5. Your site will be published at `https://yourusername.github.io/repository-name`

### Netlify
1. Create a Netlify account
2. Connect your GitHub repository
3. Deploy with default settings
4. Your site will be published at `https://your-site-name.netlify.app`

### Vercel
1. Create a Vercel account
2. Import your GitHub repository
3. Deploy with default settings
4. Your site will be published at `https://your-site-name.vercel.app`

## Customization

### Colors
The color scheme can be customized by modifying the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --dark-color: #343a40;
    --light-color: #f8f9fa;
}
```

### Animations
Animation settings can be modified in `js/main.js`:
```javascript
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});
```

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap for the responsive framework
- Font Awesome for icons
- AOS for scroll animations 