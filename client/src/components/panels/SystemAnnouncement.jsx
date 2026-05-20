import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { postNews } from '../../api';
import { useToast } from '../../context/ToastContext';
import './Panels.css';

export default function SystemAnnouncement() {
  const { news } = useApp();
  const { isAdmin } = useAdmin();
  const { addToast } = useToast();
  const pinned = news.find((n) => n.isPinned) || news.find((n) => n.type === 'announcement');

  return (
    <section className="panel announcement-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-icon"></span>
          <h2 className="panel-title">SYSTEM ANNOUNCEMENT</h2>
        </div>
        {isAdmin && <button className="view-all-btn"></button>}
      </div>
      <div className="announcement-body">
        <span className="announcement-icon"></span>
        {pinned ? (
          <>
            <h3 className="announcement-title">Welcome to QUANTUM 26!</h3>
            <p className="announcement-text">{pinned.text}</p>
          </>
        ) : (
          <>
            <h3 className="announcement-title">Welcome to QUANTUM 26!</h3>
            <p className="announcement-text">Prepare for the ultimate battle of intellect and strategy. Stay sharp, stay strong, and may the best kingdom win!</p>
          </>
        )}
      </div>
    </section>
  );
}
