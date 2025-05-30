const CommissionTracker = () => {
    const [commissions, setCommissions] = React.useState([
        // {
        //     id: 1,
        //     client: "Client A",
        //     type: "Headshot",
        //     status: "In Progress",
        //     startDate: "2024-12-20",
        //     deadline: "2024-12-30",
        //     progress: 65,
        //     price: "$12",
        //     notes: "Adding extra sparkles in the eyes"
        // },
        // {
        //     id: 2,
        //     client: "Client B",
        //     type: "Chibi Full Body",
        //     status: "Pending Payment",
        //     startDate: "2024-12-23",
        //     deadline: "2025-01-05",
        //     progress: 0,
        //     price: "$25",
        //     notes: "Waiting for initial payment"
        // },
        // {
        //     id: 3,
        //     client: "Client C",
        //     type: "Chibi Icon",
        //     status: "Completed",
        //     startDate: "2024-12-15",
        //     deadline: "2024-12-22",
        //     progress: 100,
        //     price: "$15",
        //     notes: "Delivered and paid"
        // }
    ]);

    const handleClose = React.useCallback(() => {
        const modal = document.getElementById('trackerModal');
        if (modal) {
            modal.classList.remove('show');
            // Find and remove taskbar item
            const taskbarItems = document.querySelector('.taskbar-items');
            const taskbarItem = Array.from(taskbarItems.children)
                .find(item => item.querySelector('span').textContent === 'Tracker');
            if (taskbarItem) {
                taskbarItems.removeChild(taskbarItem);
            }
            // Remove from openWindows set in script.js
            const openWindows = window.openWindows;
            if (openWindows) {
                openWindows.delete('Tracker');
            }
        }
    }, []);

    React.useEffect(() => {
        const modal = document.getElementById('trackerModal');
        if (modal) {
            const closeBtn = modal.querySelector('.close-button');
            if (closeBtn) {
                // Remove any existing listeners first
                closeBtn.removeEventListener('click', handleClose);
                // Add new listener
                closeBtn.addEventListener('click', handleClose);
            }
        }
        
        // Cleanup
        return () => {
            const modal = document.getElementById('trackerModal');
            if (modal) {
                const closeBtn = modal.querySelector('.close-button');
                if (closeBtn) {
                    closeBtn.removeEventListener('click', handleClose);
                }
            }
        };
    }, [handleClose]);

    const getStatusClass = (status) => {
        switch(status.toLowerCase()) {
            case 'in progress':
                return 'in-progress';
            case 'pending payment':
                return 'pending';
            case 'completed':
                return 'completed';
            default:
                return '';
        }
    };

    return React.createElement("div", { className: "p-4" },
        React.createElement("div", { className: "commission-tracker-container" },
            React.createElement("div", { className: "commission-tracker-summary" },
                React.createElement("h2", { className: "text-xl mb-4" }, 
                    "Active Commissions: ", commissions.length
                )
            ),
            commissions.map(commission => 
                React.createElement("div", { 
                    key: commission.id,
                    className: "commission-tracker-card"
                },
                    React.createElement("div", { className: "commission-tracker-header" },
                        React.createElement("div", { className: "commission-tracker-client" }, 
                            commission.client
                        ),
                        React.createElement("div", { className: "commission-tracker-type" }, 
                            `${commission.type} - ${commission.price}`
                        )
                    ),
                    React.createElement("div", { className: "commission-tracker-content" },
                        React.createElement("div", { className: "commission-tracker-status" },
                            React.createElement("span", { 
                                className: `commission-tracker-tag ${getStatusClass(commission.status)}`
                            }, commission.status),
                            React.createElement("span", null, `${commission.progress}%`)
                        ),
                        React.createElement("div", { className: "commission-tracker-progress" },
                            React.createElement("div", {
                                className: "commission-tracker-progress-bar",
                                style: { width: `${commission.progress}%` }
                            })
                        ),
                        React.createElement("div", { className: "commission-tracker-dates" },
                            React.createElement("span", null, `Start: ${commission.startDate}`),
                            React.createElement("span", null, `Due: ${commission.deadline}`)
                        ),
                        commission.notes && React.createElement("div", { 
                            className: "commission-tracker-notes mt-2 text-sm text-gray-500"
                        }, commission.notes)
                    )
                )
            )
        )
    );
};

// Initialize the tracker when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tracker-root')) {
        const root = ReactDOM.createRoot(document.getElementById('tracker-root'));
        root.render(React.createElement(CommissionTracker));
    }
});