import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-surface-100 to-surface-200 rounded-2xl flex items-center justify-center shadow-neu-light">
              <ApperIcon name="FileX" className="w-12 h-12 sm:w-16 sm:h-16 text-surface-400" />
            </div>
          </motion.div>

          {/* Error Message */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-6xl sm:text-7xl font-bold text-gradient"
            >
              404
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-surface-900"
            >
              File Not Found
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-surface-600 text-lg leading-relaxed"
            >
              The page you're looking for seems to have been moved, deleted, or doesn't exist.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/" className="btn-primary inline-flex items-center justify-center space-x-2">
              <ApperIcon name="Home" className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn-secondary inline-flex items-center justify-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex justify-center space-x-4 pt-8"
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-surface-300 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound