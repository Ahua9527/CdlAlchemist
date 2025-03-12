import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { CDLConverter } from '../utils/cdl';
import JSZip from 'jszip';

/**
 * ALE文件上传和处理组件
 * 
 * 该组件是应用程序的核心，负责：
 * 1. 上传ALE文件（通过拖放或点击）
 * 2. 显示上传的文件列表
 * 3. 处理文件转换（ALE到CDL）
 * 4. 将转换后的CDL文件打包成ZIP并提供下载
 */
const ALEUploader = () => {
  // 状态管理
  const [files, setFiles] = useState<File[]>([]); // 存储上传的文件
  const [isDragging, setIsDragging] = useState(false); // 拖拽状态标记
  const [processing, setProcessing] = useState(false); // 处理中状态标记
  const [currentFile, setCurrentFile] = useState<string>(''); // 当前正在处理的文件名
  const [progress, setProgress] = useState<number>(0); // 处理进度百分比
  const fileInputRef = useRef<HTMLInputElement>(null); // 文件输入元素引用

  /**
   * 处理拖拽进入事件
   * 激活拖拽状态样式
   */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * 处理拖拽离开事件
   * 停用拖拽状态样式
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * 处理拖拽悬停事件
   * 防止默认行为
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * 处理文件拖放事件
   * 接收拖放的文件并传递给handleFiles处理
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  /**
   * 处理新上传的文件
   * 验证文件类型(.ale)和大小限制(50MB)
   * 添加有效文件到文件列表状态
   */
  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => 
      file.name.toLowerCase().endsWith('.ale') && 
      file.size <= 50 * 1024 * 1024 // 50MB 大小限制
    );

    if (validFiles.length === 0) {
      alert('请上传有效的ALE文件，且文件大小不超过50MB');
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  /**
   * 从列表中移除单个文件
   */
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * 清空所有已上传文件
   */
  const clearFiles = () => {
    setFiles([]);
  };

  /**
   * 格式化文件大小显示
   * 将字节转换为易读的KB/MB形式
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  /**
   * 处理文件转换流程
   * 1. 遍历所有上传的文件
   * 2. 调用CDLConverter将ALE转换为CDL
   * 3. 使用JSZip将生成的CDL文件打包
   * 4. 创建下载链接并触发下载
   */
  const handleProcess = async () => {
    if (!files.length) return;
    
    setProcessing(true);
    setProgress(0);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFile(file.name);
        setProgress((i / files.length) * 100);
        
        try {
          // 将ALE转换为CDL
          const cdlFiles = await CDLConverter.convertALEtoCDL(file);
          
          // 创建ZIP存档
          const zip = new JSZip();
          const folderName = file.name.replace('.ale', '');
          const folder = zip.folder(folderName);
          
          if (folder && cdlFiles.length > 0) {
            // 将所有CDL文件添加到ZIP
            cdlFiles.forEach(({ filename, content }) => {
              folder.file(filename, content);
            });
            
            // 生成ZIP并触发下载
            const zipContent = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipContent);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${folderName}_CDL.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } else {
            throw new Error('导出过程中发生错误');
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error('处理文件时出错:', file.name, error);
            const errorMessage = error.message.includes('Missing required columns') ?
              '缺少必需的列: ASC_SOP, ASC_SAT\n请确保您的 ALE 文件包含这些颜色信息列。' :
              '处理文件时发生错误，请检查文件格式是否正确';
            alert(errorMessage);
          }
          break;
        }
        
        setProgress(((i + 1) / files.length) * 100);
      }
    } finally {
      // 重置处理状态
      setProcessing(false);
      setCurrentFile('');
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg transition-all duration-500 ease-in-out">
      {/* 主内容区域 */}
      <main className="flex-grow flex items-center justify-center p-6 pb-32 bg-light-bg dark:bg-dark-bg">
        <div className="w-full max-w-2xl bg-light-card dark:bg-dark-card rounded-2xl shadow-xl p-10 min-h-[400px] transition-all duration-500 ease-in-out">
          {/* 应用标题 */}
          <h1 className="text-4xl font-chalkboard font-bold text-gray-900 dark:text-white mt-8 mb-2 text-center tracking-wide transition-colors duration-500 ease-in-out [filter:drop-shadow(4px_8px_12px_rgba(0,0,0,0.3))]">
            CDL<span className="text-resolve">Alchemist</span>
          </h1>
          {/* 应用副标题 */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-12 text-center">
          从ALE到CDL，炼出色彩真金
          </p>

          <div className="space-y-6">
            {/* 文件上传区域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              上传 ALE 文件
              </label>
              {/* 拖放区域 */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
                  ${isDragging 
                    ? 'border-selected bg-cyan-50 dark:bg-cyan-900' 
                    : 'border-gray-300 dark:border-gray-600 hover:bg-light-bg dark:hover:bg-dark-bg'
                  }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* 隐藏的文件输入 */}
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept=".ale"
                  multiple
                  onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                />
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  ASC-CDL精准淬炼工坊
                  </p>
                  <p className="mt-1 text-sm text-blue-500 hover:text-blue-500">
                  点击或拖拽ALE文件到此处
                  </p>
                </div>
              </div>
            </div>

            {/* 文件列表和处理区域 */}
            {files.length > 0 && (
              <div className="space-y-4">
                {/* 文件列表标题和清空按钮 */}
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  已上传文件 ({files.length})
                  </h3>
                  <button
                    onClick={clearFiles}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    清空
                  </button>
                </div>
                {/* 文件列表项 */}
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 
                             border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                ))}

                {/* 处理进度指示器 */}
                {processing && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                    正在导出: {currentFile}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-selected h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 导出按钮 */}
                <div className="space-y-4">
                  <button
                    onClick={handleProcess}
                    disabled={processing}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-all
                      ${processing 
                        ? 'bg-selected/70 cursor-not-allowed' 
                        : 'bg-selected hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                      }`}
                  >
                    {processing ? '导出...' : `导出 CDL 文件 (${files.length})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 页脚区域 - 固定在底部 */}
      <footer className="fixed bottom-0 w-full bg-gradient-to-t from-light-bg/95 via-light-bg/80 to-light-bg/0 dark:from-dark-bg/95 dark:via-dark-bg/80 dark:to-dark-bg/0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-6">
            <a
              href="https://github.com/Ahua9527/CdlAlchemist"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-selected"
            >
              <span>GitHub</span>
            </a>
          </div>
          <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
            CDLAlchemist © 2025 | Designed & Developed by 哆啦Ahua🌱
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ALEUploader;