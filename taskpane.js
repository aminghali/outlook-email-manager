/* global Office */

Office.initialize = function (reason) {
    console.log('Office Add-in initialized');

    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
};

// Email templates configuration
const EMAIL_TEMPLATES = {
    headers: {
        UPDATE: "Status Update",
        REQUEST: "Action Required",
        MEETING: "Meeting Request",
        FOLLOWUP: "Follow-Up",
        REVIEW: "Review Requested",
        APPROVAL: "Approval Needed",
        ANNOUNCEMENT: "Important Announcement",
        REPORT: "Report Attached",
        URGENT: "🔴 URGENT",
        FYI: "For Your Information"
    },
    priorities: {
        URGENT: "High",
        APPROVAL: "High",
        REQUEST: "Normal",
        UPDATE: "Normal",
        MEETING: "Normal",
        FOLLOWUP: "Normal",
        REVIEW: "Normal",
        ANNOUNCEMENT: "Normal",
        REPORT: "Normal",
        FYI: "Low"
    }
};

let currentSelection = {
    project: '',
    emailType: '',
    customSubject: ''
};

function initializeApp() {
    // Get DOM elements
    const projectSelect = document.getElementById('projectSelect');
    const emailTypeSelect = document.getElementById('emailTypeSelect');
    const customSubject = document.getElementById('customSubject');
    const applyBtn = document.getElementById('applyBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    // Add event listeners
    projectSelect.addEventListener('change', handleSelectionChange);
    emailTypeSelect.addEventListener('change', handleSelectionChange);
    customSubject.addEventListener('input', handleSelectionChange);
    applyBtn.addEventListener('click', applyTemplate);
    clearBtn.addEventListener('click', clearForm);
    
    console.log('App initialized successfully');
}

function handleSelectionChange() {
    const projectSelect = document.getElementById('projectSelect');
    const emailTypeSelect = document.getElementById('emailTypeSelect');
    const customSubject = document.getElementById('customSubject');
    const applyBtn = document.getElementById('applyBtn');
    
    // Update current selection
    currentSelection.project = projectSelect.value;
    currentSelection.emailType = emailTypeSelect.value;
    currentSelection.customSubject = customSubject.value.trim();
    
    // Enable apply button if required fields are filled
    const isValid = currentSelection.project && currentSelection.emailType;
    applyBtn.disabled = !isValid;
    
    // Update preview
    updatePreview();
}

function updatePreview() {
    const subjectPreview = document.getElementById('subjectPreview');
    const headerPreview = document.getElementById('headerPreview');
    
    if (!currentSelection.project || !currentSelection.emailType) {
        subjectPreview.textContent = 'Select options above to generate subject...';
        headerPreview.textContent = 'Select options above to generate header...';
        return;
    }
    
    const subject = generateSubject();
    const header = generateEmailHeader();
    
    subjectPreview.textContent = subject;
    headerPreview.innerHTML = header.replace(/\n/g, '<br>');
}

function generateSubject() {
    const typeLabel = EMAIL_TEMPLATES.headers[currentSelection.emailType] || currentSelection.emailType;
    let subject = `[${currentSelection.project}] ${typeLabel}`;
    
    if (currentSelection.customSubject) {
        subject += ` - ${currentSelection.customSubject}`;
    }
    
    return subject;
}

function generateEmailHeader() {
    const projectInfo = getProjectInfo(currentSelection.project);
    const typeLabel = EMAIL_TEMPLATES.headers[currentSelection.emailType] || currentSelection.emailType;
    const priority = EMAIL_TEMPLATES.priorities[currentSelection.emailType] || 'Normal';
    const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    let header = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    header += `📋 ${typeLabel.toUpperCase()}\n`;
    header += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    header += `Project: ${projectInfo}\n`;
    header += `Type: ${typeLabel}\n`;
    header += `Priority: ${priority}\n`;
    header += `Date: ${date}\n`;
    header += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    return header;
}

function getProjectInfo(projectCode) {
    const projects = {
        'PROJECT-001': 'PROJECT-001: Alpha Initiative',
        'PROJECT-002': 'PROJECT-002: Beta Development',
        'PROJECT-003': 'PROJECT-003: Gamma Rollout',
        'PROJECT-004': 'PROJECT-004: Delta Integration',
        'PROJECT-005': 'PROJECT-005: Epsilon Platform',
        'PROJECT-006': 'PROJECT-006: Zeta Migration',
        'INTERNAL': 'Internal Communication',
        'CLIENT': 'Client Relations',
        'VENDOR': 'Vendor Management'
    };
    
    return projects[projectCode] || projectCode;
}

function applyTemplate() {
    const applyBtn = document.getElementById('applyBtn');
    applyBtn.disabled = true;
    applyBtn.textContent = 'Applying...';
    
    Office.context.mailbox.item.subject.getAsync(function(result) {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
            const newSubject = generateSubject();
            
            // Set the subject
            Office.context.mailbox.item.subject.setAsync(newSubject, function(setResult) {
                if (setResult.status === Office.AsyncResultStatus.Succeeded) {
                    // Now set the body with header
                    prependEmailHeader();
                } else {
                    showStatus('Error setting subject: ' + setResult.error.message, 'error');
                    applyBtn.disabled = false;
                    applyBtn.textContent = 'Apply Template';
                }
            });
        } else {
            showStatus('Error reading subject: ' + result.error.message, 'error');
            applyBtn.disabled = false;
            applyBtn.textContent = 'Apply Template';
        }
    });
}

function prependEmailHeader() {
    const header = generateEmailHeader();
    const applyBtn = document.getElementById('applyBtn');
    
    // Get current body
    Office.context.mailbox.item.body.getAsync(Office.CoercionType.Text, function(result) {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
            const currentBody = result.value;
            const newBody = header + '\n\n' + currentBody;
            
            // Set new body with header prepended
            Office.context.mailbox.item.body.setAsync(newBody, {coercionType: Office.CoercionType.Text}, function(setResult) {
                if (setResult.status === Office.AsyncResultStatus.Succeeded) {
                    showStatus('✓ Template applied successfully!', 'success');
                    
                    // Set importance/priority
                    const priority = EMAIL_TEMPLATES.priorities[currentSelection.emailType];
                    if (priority === 'High') {
                        Office.context.mailbox.item.notificationMessages.addAsync('priority-set', {
                            type: 'informationalMessage',
                            message: 'Email marked as High Priority',
                            icon: 'icon1',
                            persistent: false
                        });
                    }
                } else {
                    showStatus('Error setting body: ' + setResult.error.message, 'error');
                }
                
                applyBtn.disabled = false;
                applyBtn.textContent = 'Apply Template';
            });
        } else {
            showStatus('Error reading body: ' + result.error.message, 'error');
            applyBtn.disabled = false;
            applyBtn.textContent = 'Apply Template';
        }
    });
}

function clearForm() {
    document.getElementById('projectSelect').value = '';
    document.getElementById('emailTypeSelect').value = '';
    document.getElementById('customSubject').value = '';
    
    currentSelection = {
        project: '',
        emailType: '',
        customSubject: ''
    };
    
    document.getElementById('applyBtn').disabled = true;
    updatePreview();
    
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.classList.remove('success', 'error');
    statusMessage.style.display = 'none';
}

function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.classList.remove('success', 'error');
    statusMessage.classList.add(type);
    statusMessage.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
}