export function showNotification(message, type = 'success') {
    const container = document.getElementById('notifications-container');
    if (!container) {
        alert(message);
        return;
    }

    const notif = document.createElement('div');
    notif.className = `notification notification--${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: #fff;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

    container.appendChild(notif);
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(100%)';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}