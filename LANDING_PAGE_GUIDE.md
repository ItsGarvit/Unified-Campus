# MentorMatch Landing Page

A modern, high-conversion landing page built with React, Tailwind CSS, Motion (Framer Motion), and Lucide Icons.

## 🎨 Features

### Design & Aesthetics
- **Playful, Modern Design**: Vibrant pastel colors (blues, pinks, yellows, greens) with organic shapes
- **Dark Mode Support**: Full theme toggle with smooth transitions
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Smooth Animations**: Motion-powered animations throughout the page

### Sections

1. **Header**
   - Fixed navigation with Logo, About/Features/Contact links
   - Login/Signup button
   - Theme toggle (Light/Dark mode)

2. **Hero Section**
   - Welcoming headline with call-to-action
   - Animated decorative tiles
   - GET STARTED button
   - Scroll indicator animation

3. **Stats Section**
   - Animated counter showing:
     - Students Registered: 2,547+
     - Expert Mentors: 342+
     - Successful Placements: 1,823+
   - Counters animate when scrolled into view

4. **About Section**
   - Mission statement
   - Platform overview
   - Background decorative animations

5. **Features Section**
   - 6 core features with icons and descriptions:
     - Personalized Matching
     - Real-Time Communication
     - Verified Professionals
     - Community Network
     - Resource Library
     - Placement Support

6. **Contact Section**
   - Contact information (Email, Phone, Location)
   - Contact form
   - Smooth hover effects

7. **Footer**
   - Quick links
   - Resources
   - Social media icons
   - Copyright information

### Interactive Elements

#### Get Started Modal
- Choose between Student or Mentor signup
- Location access prompt for first-time users
- Smooth modal animations with backdrop blur

#### Animations
- Scroll-triggered animations using Motion's `useInView`
- Hover effects on cards and buttons
- Rotating background shapes
- Animated tiles in hero section
- Counting animations for statistics

## 🛠 Tech Stack

- **React 18.3.1**: Component-based UI
- **Tailwind CSS 4.1**: Utility-first styling
- **Motion (Framer Motion) 12.23.24**: Smooth animations
- **Lucide React 0.487.0**: Beautiful icons
- **TypeScript**: Type-safe code

## 🎯 Key Components

```
/src/app/
├── App.tsx                      # Main app component
└── components/
    ├── Header.tsx               # Navigation header
    ├── HeroSection.tsx          # Hero with CTA
    ├── StatsSection.tsx         # Animated statistics
    ├── AboutSection.tsx         # About platform
    ├── FeaturesSection.tsx      # Core features grid
    ├── ContactSection.tsx       # Contact info & form
    ├── GetStartedModal.tsx      # Signup modal
    └── Footer.tsx               # Footer links
```

## 🎨 Color Scheme

### Light Mode
- Background: Blue-Purple-Pink gradient
- Cards: Pastel colors (pink, yellow, green, blue)
- Text: Dark gray/black
- Borders: Black

### Dark Mode
- Background: Dark gray gradient
- Cards: Darker pastel shades
- Text: White/light gray
- Borders: White

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Future Enhancements

- Add testimonials carousel
- Implement FAQ accordion
- Add success stories section
- Connect to real backend API
- Add authentication system
- Implement actual mentor/student dashboards
- Add search/filter functionality for mentors

## 💡 Usage Notes

### Theme Toggle
The theme automatically detects system preference on first load and can be manually toggled.

### Location Access
The modal requests location permission to help match users with nearby mentors. This is optional and can be skipped.

### Smooth Scrolling
Navigation links smoothly scroll to their respective sections on the page.

## 🎭 Animation Details

- **Entry Animations**: Elements fade in and slide from different directions
- **Hover Animations**: Cards scale and rotate slightly on hover
- **Scroll Animations**: Triggered when sections come into view
- **Background Animations**: Subtle rotating gradient shapes
- **Counter Animations**: Numbers count up when visible

## 📝 Customization

To customize the landing page:

1. **Change Colors**: Update gradient classes in component files
2. **Modify Stats**: Edit values in `StatsSection.tsx`
3. **Add Features**: Add items to the features array in `FeaturesSection.tsx`
4. **Update Content**: Modify text in respective component files
5. **Adjust Animations**: Modify Motion animation props

---

Built with ❤️ for MentorMatch
