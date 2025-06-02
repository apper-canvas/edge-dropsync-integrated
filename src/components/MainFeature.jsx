import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { format } from 'date-fns'

const MainFeature = () => {
  const [files, setFiles] = useState([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploadQueue, setUploadQueue] = useState([])
  const [currentFolder, setCurrentFolder] = useState('root')
  const [folders, setFolders] = useState([
    { id: 'root', name: 'My Files', parentId: null, fileCount: 0 },
    { id: 'documents', name: 'Documents', parentId: 'root', fileCount: 0 },
    { id: 'images', name: 'Images', parentId: 'root', fileCount: 0 },
    { id: 'videos', name: 'Videos', parentId: 'root', fileCount: 0 }
  ])
  const fileInputRef = useRef(null)

  const allowedTypes = {
    'image/*': ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    'application/pdf': ['pdf'],
    'text/*': ['txt', 'md', 'csv'],
    'application/msword': ['doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
    'video/*': ['mp4', 'avi', 'mov', 'wmv', 'flv'],
    'audio/*': ['mp3', 'wav', 'flac', 'aac']
  }

  const maxFileSize = 10 * 1024 * 1024 // 10MB
  const maxTotalSize = 100 * 1024 * 1024 // 100MB

  const validateFile = (file) => {
    const errors = []
    
    if (file.size > maxFileSize) {
      errors.push(`File size exceeds 10MB limit`)
    }

    const extension = file.name.split('.').pop().toLowerCase()
    const isValidType = Object.entries(allowedTypes).some(([mimeType, extensions]) => {
      return file.type.match(mimeType) || extensions.includes(extension)
    })

    if (!isValidType) {
      errors.push(`File type not supported`)
    }

    return errors
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file) => {
    const type = file.type.split('/')[0]
    const extension = file.name.split('.').pop().toLowerCase()

    if (type === 'image') return 'Image'
    if (type === 'video') return 'Video'
    if (type === 'audio') return 'Music'
    if (extension === 'pdf') return 'FileText'
    if (['doc', 'docx'].includes(extension)) return 'FileText'
    if (['txt', 'md'].includes(extension)) return 'FileText'
    return 'File'
  }

  const simulateUpload = (file) => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          resolve()
        }
        setUploadProgress(prev => ({
          ...prev,
          [file.id]: Math.min(progress, 100)
        }))
      }, 200 + Math.random() * 300)
    })
  }

  const handleFiles = useCallback(async (newFiles) => {
    const fileArray = Array.from(newFiles)
    const totalCurrentSize = files.reduce((sum, file) => sum + file.size, 0)
    const totalNewSize = fileArray.reduce((sum, file) => sum + file.size, 0)

    if (totalCurrentSize + totalNewSize > maxTotalSize) {
      toast.error('Total file size exceeds 100MB limit')
      return
    }

    const validFiles = []
    const invalidFiles = []

    fileArray.forEach(file => {
      const errors = validateFile(file)
      const fileWithId = {
        ...file,
        id: Math.random().toString(36).substr(2, 9),
        uploadDate: new Date(),
        status: 'pending',
        folderId: currentFolder,
        errors
      }

      if (errors.length === 0) {
        validFiles.push(fileWithId)
      } else {
        invalidFiles.push(fileWithId)
        toast.error(`${file.name}: ${errors.join(', ')}`)
      }
    })

    if (validFiles.length > 0) {
      setUploadQueue(prev => [...prev, ...validFiles])
      toast.success(`${validFiles.length} file(s) added to upload queue`)

      // Start uploading
      for (const file of validFiles) {
        setFiles(prev => [...prev, { ...file, status: 'uploading' }])
        setUploadProgress(prev => ({ ...prev, [file.id]: 0 }))
        
        try {
          await simulateUpload(file)
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'completed', url: URL.createObjectURL(file) } : f
          ))
          setUploadProgress(prev => ({ ...prev, [file.id]: 100 }))
          toast.success(`${file.name} uploaded successfully`)
        } catch (error) {
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'failed' } : f
          ))
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      setUploadQueue(prev => prev.filter(f => !validFiles.includes(f)))
    }
  }, [files, currentFolder])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = e.dataTransfer.files
    handleFiles(droppedFiles)
  }, [handleFiles])

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files
    handleFiles(selectedFiles)
    e.target.value = '' // Reset input
  }

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    setUploadProgress(prev => {
      const { [fileId]: removed, ...rest } = prev
      return rest
    })
    toast.success('File removed successfully')
  }

  const clearAllFiles = () => {
    setFiles([])
    setUploadProgress({})
    setUploadQueue([])
    toast.success('All files cleared')
  }

  const currentFolderData = folders.find(f => f.id === currentFolder)
  const currentFolderFiles = files.filter(f => f.folderId === currentFolder)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Folder Navigation */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="FolderOpen" className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-surface-900">
              {currentFolderData?.name || 'My Files'}
            </h3>
            <span className="text-sm text-surface-500 bg-surface-100 px-2 py-1 rounded-lg">
              {currentFolderFiles.length} files
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {folders.filter(f => f.id !== 'root').map(folder => (
              <motion.button
                key={folder.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentFolder(folder.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentFolder === folder.id
                    ? 'bg-primary text-white shadow-card'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {folder.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <motion.div
        className={`upload-zone p-8 sm:p-12 lg:p-16 text-center min-h-48 sm:min-h-56 lg:min-h-64 ${
          isDragOver ? 'upload-zone-dragover' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="drag-overlay"
            >
              <div className="text-center">
                <ApperIcon name="Download" className="w-12 h-12 text-primary mb-4 mx-auto animate-bounce-gentle" />
                <p className="text-lg font-semibold text-primary">Drop files here to upload</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={{ opacity: isDragOver ? 0.3 : 1 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-upload"
            >
              <ApperIcon name="CloudUpload" className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-surface-900">
              Drag & Drop Files Here
            </h3>
            <p className="text-surface-600 text-sm sm:text-base max-w-md mx-auto">
              or click to browse and select files from your device
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ApperIcon name="Upload" className="w-4 h-4" />
              <span>Choose Files</span>
            </motion.button>

            {files.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFiles}
                className="btn-secondary inline-flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
                <span>Clear All</span>
              </motion.button>
            )}
          </div>

          <div className="text-xs sm:text-sm text-surface-500 space-y-1">
            <p>Supported formats: Images, Videos, Documents, Audio files</p>
            <p>Maximum file size: 10MB • Maximum total: 100MB</p>
          </div>
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.md,.csv"
        />
      </motion.div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-surface-900 flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-5 h-5 text-orange-500" />
              <span>Upload Queue ({uploadQueue.length})</span>
            </h4>
          </div>
          <div className="space-y-2">
            {uploadQueue.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <ApperIcon name={getFileIcon(file)} className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-surface-900">{file.name}</span>
                </div>
                <div className="text-xs text-orange-600 font-medium">Queued</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* File List */}
      {currentFolderFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h4 className="text-lg font-semibold text-surface-900 flex items-center space-x-2">
              <ApperIcon name="Files" className="w-5 h-5 text-primary" />
              <span>Uploaded Files ({currentFolderFiles.length})</span>
            </h4>
            
            <div className="flex items-center space-x-2 text-sm text-surface-600">
              <ApperIcon name="HardDrive" className="w-4 h-4" />
              <span>
                {formatFileSize(currentFolderFiles.reduce((sum, file) => sum + file.size, 0))} total
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence>
              {currentFolderFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="file-item p-4 group"
                >
                  <div className="flex items-start space-x-4">
                    {/* File Icon/Preview */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        file.status === 'completed' ? 'bg-green-100' :
                        file.status === 'uploading' ? 'bg-blue-100' :
                        file.status === 'failed' ? 'bg-red-100' : 'bg-surface-100'
                      }`}>
                        <ApperIcon 
                          name={getFileIcon(file)} 
                          className={`w-6 h-6 ${
                            file.status === 'completed' ? 'text-green-600' :
                            file.status === 'uploading' ? 'text-blue-600' :
                            file.status === 'failed' ? 'text-red-600' : 'text-surface-600'
                          }`} 
                        />
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h5 className="text-sm font-semibold text-surface-900 truncate group-hover:text-primary transition-colors">
                            {file.name}
                          </h5>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-surface-500">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{format(file.uploadDate, 'MMM dd, HH:mm')}</span>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFile(file.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                        >
                          <ApperIcon name="X" className="w-4 h-4 text-red-500" />
                        </motion.button>
                      </div>

                      {/* Progress Bar */}
                      {file.status === 'uploading' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-surface-600 mb-1">
                            <span>Uploading...</span>
                            <span>{Math.round(uploadProgress[file.id] || 0)}%</span>
                          </div>
                          <div className="progress-bar">
                            <motion.div
                              className="progress-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress[file.id] || 0}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="mt-2">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          file.status === 'completed' ? 'bg-green-100 text-green-800' :
                          file.status === 'uploading' ? 'bg-blue-100 text-blue-800' :
                          file.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-surface-100 text-surface-800'
                        }`}>
                          <ApperIcon 
                            name={
                              file.status === 'completed' ? 'CheckCircle' :
                              file.status === 'uploading' ? 'Loader' :
                              file.status === 'failed' ? 'AlertCircle' : 'Clock'
                            } 
                            className={`w-3 h-3 ${file.status === 'uploading' ? 'animate-spin' : ''}`}
                          />
                          <span className="capitalize">{file.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Storage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="glass-card p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-surface-900">Storage Usage</h4>
          <span className="text-sm text-surface-600">
            {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))} / 100MB
          </span>
        </div>
        
        <div className="progress-bar h-3">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(files.reduce((sum, file) => sum + file.size, 0) / maxTotalSize) * 100}%` 
            }}
            transition={{ duration: 0.8 }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-surface-500 mt-2">
          <span>0MB</span>
          <span>100MB</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MainFeature