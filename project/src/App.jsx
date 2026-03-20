import React, { useState, useEffect } from 'react';
import './App.css';

const Init = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="container">
      <div className="glow-bg">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
        <div className="glow glow-3"></div>
      </div>
      <div className="noise"></div>
      <div className="grid"></div>
      <main className="content">
        <div className={`content-inner ${isLoaded ? 'loaded' : ''}`}>
          <div className="badge">
            <span className="badge-icon">✨</span>
            <span className="badge-text">系统已就绪，等待注入灵魂</span>
          </div>
          <h1 className="title">
            这是一张<span className="highlight">空白画布</span>
          </h1>
          <p className="subtitle">
            请开始构建你的项目
          </p>
        </div>
      </main>
    </div>
  );
};

export default Init;