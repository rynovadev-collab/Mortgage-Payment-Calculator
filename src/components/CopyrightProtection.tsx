/*
 * AmortIQ - Copyright Protection System
 * Copyright (c) 2024 AmortIQ. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * Unauthorized copying, modification, distribution, or use of this software
 * or any portion thereof is strictly prohibited and may result in severe
 * civil and criminal penalties.
 */

import { useEffect } from 'react';

const CopyrightProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      console.warn('⚠️ Copyright Notice: This content is protected by AmortIQ.');
      return false;
    };

    // Detect DevTools opening
    const devToolsDetect = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        console.clear();
        displayCopyrightWarning();
      }
    };

    // Display prominent copyright warning in console
    const displayCopyrightWarning = () => {
      const styles = [
        'color: #ff0000',
        'font-size: 20px',
        'font-weight: bold',
        'text-shadow: 2px 2px 4px rgba(0,0,0,0.3)',
        'padding: 20px',
        'background: #ffebee',
        'border: 3px solid #ff0000',
        'border-radius: 5px'
      ].join(';');

      const warningText = `
╔═══════════════════════════════════════════════════════════════╗
║                       ⚠️  LEGAL WARNING  ⚠️                    ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  This website and its source code are protected by:          ║
║  • Copyright Law (Copyright, Designs and Patents Act 1988)   ║
║  • Trade Secret Law                                          ║
║  • Terms of Service Agreement                                ║
║                                                               ║
║  Unauthorized copying, modification, reverse engineering,    ║
║  distribution, or commercial use of this code is:            ║
║  • STRICTLY PROHIBITED                                       ║
║  • A BREACH OF COPYRIGHT LAW                                 ║
║  • SUBJECT TO LEGAL ACTION                                   ║
║                                                               ║
║  © 2024 AmortIQ. All Rights Reserved.                        ║
║  Proprietary and Confidential.                               ║
║                                                               ║
║  If you're interested in licensing this software,            ║
║  please contact: legal@amortiq.co.uk                         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
      `;

      console.log('%c' + warningText, styles);
      
      console.warn(
        '%c🚨 DEVELOPER NOTICE 🚨',
        'color: red; font-size: 16px; font-weight: bold;'
      );
      
      console.warn(
        'Attempting to copy, modify, or reuse this code without written permission from AmortIQ is illegal and will result in legal action.'
      );
      
      console.log(
        '%cThis application is monitored and all access is logged.',
        'color: orange; font-weight: bold;'
      );
    };

    // Disable common keyboard shortcuts for viewing source
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        console.warn('⚠️ This action is disabled. Copyright protected content.');
        return false;
      }
    };

    // Disable text selection on sensitive elements
    const disableSelection = () => {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    };

    // Display warning immediately
    displayCopyrightWarning();

    // Check for DevTools periodically
    const devToolsInterval = setInterval(devToolsDetect, 1000);

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    disableSelection();

    // Add copyright meta tag
    const meta = document.createElement('meta');
    meta.name = 'copyright';
    meta.content = '© 2024 AmortIQ. All Rights Reserved. Proprietary and Confidential.';
    document.head.appendChild(meta);

    // Cleanup
    return () => {
      clearInterval(devToolsInterval);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, []);

  return null; // This is a behavior-only component
};

export default CopyrightProtection;
