import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-card">
                  <ApperIcon name="Cloud" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white animate-pulse-soft"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">DropSync</h1>
                <p className="text-xs sm:text-sm text-surface-600 font-medium">File Management Platform</p>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 sm:p-3 rounded-xl bg-white shadow-card border border-surface-100 hover:border-primary/20 transition-all duration-200"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-surface-600" 
                />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center space-x-2 btn-secondary"
              >
                <ApperIcon name="Settings" className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 mb-4">
              Upload, Organize & 
              <span className="text-gradient"> Manage Files</span>
            </h2>
            <p className="text-lg sm:text-xl text-surface-600 max-w-2xl mx-auto leading-relaxed">
              Seamlessly upload and manage your files with our powerful drag-and-drop interface. 
              Track progress, validate formats, and organize everything effortlessly.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            {[
              { icon: "Upload", label: "Files Uploaded", value: "2.4K+", color: "primary" },
              { icon: "FolderOpen", label: "Folders Created", value: "156", color: "secondary" },
              { icon: "HardDrive", label: "Storage Used", value: "1.2GB", color: "accent" },
              { icon: "Clock", label: "Upload Speed", value: "Fast", color: "primary" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-4 sm:p-6 text-center group"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-${stat.color} to-${stat.color}-light flex items-center justify-center shadow-card group-hover:shadow-soft transition-all duration-200`}>
                  <ApperIcon name={stat.icon} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-surface-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-surface-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Feature Component */}
          <MainFeature />

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 sm:mt-16"
          >
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-4">
                Powerful Features
              </h3>
              <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                Everything you need for efficient file management in one platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: "MousePointer2",
                  title: "Drag & Drop Upload",
                  description: "Simply drag files into the upload zone for instant uploading with visual feedback"
                },
                {
                  icon: "BarChart3",
                  title: "Progress Tracking",
                  description: "Real-time upload progress with detailed status updates and error handling"
                },
                {
                  icon: "Shield",
                  title: "File Validation",
                  description: "Automatic file type and size validation to ensure secure uploads"
                },
                {
                  icon: "Layers",
                  title: "Batch Operations",
                  description: "Upload multiple files simultaneously with queue management"
                },
                {
                  icon: "Eye",
                  title: "File Preview",
                  description: "Preview uploaded files with metadata and quick actions"
                },
                {
                  icon: "Folder",
                  title: "Smart Organization",
                  description: "Organize files into folders with automatic categorization"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="neu-card p-6 sm:p-8 group cursor-pointer"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                    <ApperIcon name={feature.icon} className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-surface-900 mb-3">{feature.title}</h4>
                  <p className="text-surface-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}

export default Home