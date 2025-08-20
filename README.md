# AWWA Beacon - Educational Management System

A comprehensive React-based web application for managing special needs education programs, student data, behavior tracking, and administrative tasks.

## 🎯 Overview

AWWA Beacon is a modern web application designed to streamline the management of educational programs for students with special needs. The system provides tools for tracking student progress, managing behavior descriptors, generating reports, and handling administrative tasks.

## ✨ Features

### 🏠 Dashboard
- **Student Management**: View and manage student information including age, diagnosis, and status
- **Search & Filter**: Advanced search functionality with sorting capabilities
- **Status Tracking**: Monitor student entry, review, and exit statuses
- **Quick Actions**: Edit student information and access detailed views

### 👨‍💼 Admin Dashboard
- **Class Management**: Overview of all classes with student and staff counts
- **Team Management**: Manage team members and care therapists (CTs)
- **Client Management**: Handle client information and enrollment data
- **Analytics**: Summary cards showing total classes, students, and staff

### 📊 Behavior Tracking
- **Behavior Descriptors**: Detailed tracking of student behaviors
- **GCO (Goal-Centered Outcomes)**: Monitor and update student goals
- **Context Analysis**: Record triggers, actions, and environmental context
- **IEP Integration**: Link behaviors to Individualized Education Program goals

### 📈 Reporting
- **Report Generation**: Create comprehensive student reports
- **Data Export**: Export behavior and progress data
- **Customizable Reports**: Select specific behavior descriptors for reporting

### 👥 User Management
- **Role-Based Access**: Different interfaces for users and administrators
- **Profile Settings**: User profile management and preferences
- **Team Member Management**: Add, edit, and manage staff information

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Notifications**: Sonner

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zaheen-Systems/awwa-frontend.git
   cd awwa-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
awwa/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── AdminDashboard.tsx  # Admin interface
│   │   ├── StudentDetailPage.tsx
│   │   ├── BehaviorDescriptorDetailPage.tsx
│   │   ├── ReportGenerationPage.tsx
│   │   └── ...                 # Other components
│   ├── styles/
│   │   └── globals.css         # Global styles
│   ├── App.tsx                 # Main application component
│   └── main.tsx               # Application entry point
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🎨 UI Components

The application uses a comprehensive set of UI components from shadcn/ui:

- **Navigation**: Sidebar, breadcrumbs, navigation menus
- **Data Display**: Tables, cards, badges, avatars
- **Forms**: Inputs, selects, checkboxes, radio groups
- **Feedback**: Alerts, toasts, progress indicators
- **Layout**: Accordions, collapsible panels, tabs
- **Overlays**: Modals, dialogs, popovers, tooltips

## 🔐 Authentication

The application includes a login system with role-based access:
- **User Role**: Access to student dashboard and basic features
- **Admin Role**: Full access to administrative functions

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - UI components used under MIT license
- [Unsplash](https://unsplash.com) - Photos used under license
- [Radix UI](https://www.radix-ui.com/) - Primitive UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

For support and questions, please contact the development team or create an issue in the GitHub repository.

---

**Built with ❤️ for AWWA's educational mission**
