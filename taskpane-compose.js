/* global Office */

let projectConfig = null;
let currentSelection = {
    project: '',
    emailType: '',
    customSubject: '',
    addProjectManager: false,
    addTeamMembers: false,
    addClientGroup: false,
    addContractors: false
};

Office.initialize = function (reason) {
    console.log('Office Add-in initialized (Compose Mode)');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
};

async function initializeApp() {
    console.log('initializeApp() called - Compose Mode');

    // Load project configuration
    await loadProjectConfig();

    // Populate dropdowns
    populateProjectDropdown();
    populateEmailTypeDropdown();

    // Get DOM elements and attach listeners
    document.getElementById('projectSelect').addEventListener('change', handleSelectionChange);
    document.getElementById('emailTypeSelect').addEventListener('change', handleSelectionChange);
    document.getElementById('customSubject').addEventListener('input', handleSelectionChange);
    document.getElementById('addProjectManager').addEventListener('change', handleSelectionChange);
    document.getElementById('addTeamMembers').addEventListener('change', handleSelectionChange);
    document.getElementById('addClientGroup').addEventListener('change', handleSelectionChange);
    document.getElementById('addContractors').addEventListener('change', handleSelectionChange);
    document.getElementById('applyBtn').addEventListener('click', applyTemplate);
    document.getElementById('clearBtn').addEventListener('click', clearForm);

    console.log('App initialized successfully - Compose Mode');
}

async function loadProjectConfig() {
    try {
        const response = await fetch('project-config.json');
        projectConfig = await response.json();
        console.log('Project configuration loaded:', projectConfig);
    } catch (error) {
        console.error('Failed to load project configuration:', error);
        showStatus('Error loading configuration: ' + error.message, 'error');
    }
}

function populateProjectDropdown() {
    const select = document.getElementById('projectSelect');
    select.innerHTML = '<option value="">-- Choose a project --</option>';

    if (projectConfig && projectConfig.projects) {
        projectConfig.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.code;
            option.textContent = project.displayName;
            select.appendChild(option);
        });
    }
}

function populateEmailTypeDropdown() {
    const select = document.getElementById('emailTypeSelect');
    select.innerHTML = '<option value="">-- Choose email type --</option>';

    if (projectConfig && projectConfig.emailTypes) {
        projectConfig.emailTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.code;
            option.textContent = type.name;
            select.appendChild(option);
        });
    }
}

function handleSelectionChange() {
    console.log('handleSelectionChange() triggered');

    // Update current selection
    currentSelection.project = document.getElementById('projectSelect').value;
    currentSelection.emailType = document.getElementById('emailTypeSelect').value;
    currentSelection.customSubject = document.getElementById('customSubject').value.trim();
    currentSelection.addProjectManager = document.getElementById('addProjectManager').checked;
    currentSelection.addTeamMembers = document.getElementById('addTeamMembers').checked;
    currentSelection.addClientGroup = document.getElementById('addClientGroup').checked;
    currentSelection.addContractors = document.getElementById('addContractors').checked;

    console.log('Current selection:', currentSelection);

    // Update recipient info display
    updateRecipientInfo();

    // Enable apply button if required fields are filled
    const isValid = currentSelection.project && currentSelection.emailType;
    document.getElementById('applyBtn').disabled = !isValid;

    // Update preview
    updatePreview();
}

function updateRecipientInfo() {
    const project = getProjectByCode(currentSelection.project);

    // Project Manager
    const pmInfo = document.getElementById('pmInfo');
    if (project && project.projectManager) {
        pmInfo.textContent = `${project.projectManager.name} (${project.projectManager.email})`;
        document.getElementById('addProjectManager').disabled = false;
    } else {
        pmInfo.textContent = 'No project manager assigned';
        document.getElementById('addProjectManager').disabled = true;
        document.getElementById('addProjectManager').checked = false;
    }

    // Team Members
    const teamInfo = document.getElementById('teamInfo');
    if (project && project.teamMembers && project.teamMembers.length > 0) {
        const teamNames = project.teamMembers.map(m => m.name).join(', ');
        teamInfo.textContent = teamNames;
        document.getElementById('addTeamMembers').disabled = false;
    } else {
        teamInfo.textContent = 'No team members assigned';
        document.getElementById('addTeamMembers').disabled = true;
        document.getElementById('addTeamMembers').checked = false;
    }

    // Client Group
    const clientInfo = document.getElementById('clientInfo');
    if (project && project.clientGroup) {
        clientInfo.textContent = `${project.clientGroup.name} (${project.clientGroup.email})`;
        document.getElementById('addClientGroup').disabled = false;
    } else {
        clientInfo.textContent = 'No client group assigned';
        document.getElementById('addClientGroup').disabled = true;
        document.getElementById('addClientGroup').checked = false;
    }

    // Contractors
    const contractorInfo = document.getElementById('contractorInfo');
    if (project && project.contractors && project.contractors.length > 0) {
        const contractorNames = project.contractors.map(c => c.name).join(', ');
        contractorInfo.textContent = contractorNames;
        document.getElementById('addContractors').disabled = false;
    } else {
        contractorInfo.textContent = 'No contractors assigned';
        document.getElementById('addContractors').disabled = true;
        document.getElementById('addContractors').checked = false;
    }
}

function updatePreview() {
    if (!currentSelection.project || !currentSelection.emailType) {
        document.getElementById('subjectPreview').textContent = 'Select options above to generate subject...';
        document.getElementById('headerPreview').textContent = 'Select options above to generate header...';
        document.getElementById('categoryPreview').innerHTML = '';
        return;
    }

    const subject = generateSubject();
    const header = generateEmailHeader();
    const categories = getCategoriesToApply();

    document.getElementById('subjectPreview').textContent = subject;
    document.getElementById('headerPreview').innerHTML = header.replace(/\n/g, '<br>');

    // Display categories
    const categoryPreview = document.getElementById('categoryPreview');
    if (categories.length > 0) {
        categoryPreview.innerHTML = categories.map(cat =>
            `<span class="category-badge">${cat}</span>`
        ).join('');
    } else {
        categoryPreview.innerHTML = '<span style="color: #666; font-size: 11px;">No categories</span>';
    }
}

function generateSubject() {
    const emailType = getEmailTypeByCode(currentSelection.emailType);
    const project = getProjectByCode(currentSelection.project);

    let subject = `[${project.code}] ${emailType.name}`;

    if (currentSelection.customSubject) {
        subject += ` - ${currentSelection.customSubject}`;
    }

    return subject;
}

function generateEmailHeader() {
    const project = getProjectByCode(currentSelection.project);
    const emailType = getEmailTypeByCode(currentSelection.emailType);
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let header = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    header += `📋 ${emailType.name.toUpperCase()}\n`;
    header += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    header += `Project: ${project.displayName}\n`;
    header += `Type: ${emailType.name}\n`;
    header += `Priority: ${emailType.priority}\n`;
    header += `Date: ${date}\n`;
    header += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    return header;
}

function getCategoriesToApply() {
    const categories = [];
    const project = getProjectByCode(currentSelection.project);
    const emailType = getEmailTypeByCode(currentSelection.emailType);

    if (project) {
        categories.push(project.category);
    }

    if (emailType) {
        categories.push(emailType.category);
    }

    return categories;
}

function getProjectByCode(code) {
    if (!projectConfig || !code) return null;
    return projectConfig.projects.find(p => p.code === code);
}

function getEmailTypeByCode(code) {
    if (!projectConfig || !code) return null;
    return projectConfig.emailTypes.find(t => t.code === code);
}

async function applyTemplate() {
    console.log('applyTemplate() called');

    const applyBtn = document.getElementById('applyBtn');
    applyBtn.disabled = true;
    applyBtn.textContent = 'Applying...';

    try {
        // Step 1: Set subject
        await setSubject();

        // Step 2: Set body with header
        await setBody();

        // Step 3: Apply categories
        await applyCategories();

        // Step 4: Add recipients
        await addRecipients();

        // Step 5: Set custom properties
        await setCustomProperties();

        showStatus('✓ Template applied successfully!', 'success');
        console.log('Template applied successfully');
    } catch (error) {
        console.error('Error applying template:', error);
        showStatus('Error: ' + error.message, 'error');
    } finally {
        applyBtn.disabled = false;
        applyBtn.textContent = 'Apply Template';
    }
}

function setSubject() {
    return new Promise((resolve, reject) => {
        const newSubject = generateSubject();
        Office.context.mailbox.item.subject.setAsync(newSubject, function(result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                console.log('Subject set successfully');
                resolve();
            } else {
                reject(new Error('Failed to set subject: ' + result.error.message));
            }
        });
    });
}

function setBody() {
    return new Promise((resolve, reject) => {
        const header = generateEmailHeader();

        Office.context.mailbox.item.body.getAsync(Office.CoercionType.Text, function(result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const currentBody = result.value;
                const newBody = header + '\n\n' + currentBody;

                Office.context.mailbox.item.body.setAsync(newBody, {coercionType: Office.CoercionType.Text}, function(setResult) {
                    if (setResult.status === Office.AsyncResultStatus.Succeeded) {
                        console.log('Body set successfully');
                        resolve();
                    } else {
                        reject(new Error('Failed to set body: ' + setResult.error.message));
                    }
                });
            } else {
                reject(new Error('Failed to read body: ' + result.error.message));
            }
        });
    });
}

async function applyCategories() {
    const categories = getCategoriesToApply();
    if (categories.length === 0) return;

    console.log('Applying categories:', categories);

    return new Promise((resolve, reject) => {
        // First, ensure categories exist in master list
        Office.context.mailbox.masterCategories.getAsync(function(result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const existingCategories = result.value.map(cat => cat.displayName);
                const categoriesToCreate = [];

                const project = getProjectByCode(currentSelection.project);

                categories.forEach((catName, index) => {
                    if (!existingCategories.includes(catName)) {
                        categoriesToCreate.push({
                            displayName: catName,
                            color: Office.MailboxEnums.CategoryColor['Preset' + index]
                        });
                    }
                });

                // Create missing categories
                if (categoriesToCreate.length > 0) {
                    Office.context.mailbox.masterCategories.addAsync(categoriesToCreate, function(addResult) {
                        if (addResult.status === Office.AsyncResultStatus.Succeeded) {
                            console.log('Categories created');
                            applyCategoriestoItem(categories, resolve, reject);
                        } else {
                            console.warn('Warning: Could not create categories:', addResult.error.message);
                            // Continue anyway and try to apply
                            applyCategoriestoItem(categories, resolve, reject);
                        }
                    });
                } else {
                    applyCategoriestoItem(categories, resolve, reject);
                }
            } else {
                console.warn('Warning: Could not get master categories');
                applyCategoriestoItem(categories, resolve, reject);
            }
        });
    });
}

function applyCategoriestoItem(categories, resolve, reject) {
    Office.context.mailbox.item.categories.addAsync(categories, function(result) {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
            console.log('Categories applied to item');
            resolve();
        } else {
            console.error('Failed to apply categories:', result.error.message);
            // Don't reject, just warn - continue with other operations
            resolve();
        }
    });
}

async function addRecipients() {
    const project = getProjectByCode(currentSelection.project);
    if (!project) return;

    const recipientsToAdd = [];

    // Project Manager to CC
    if (currentSelection.addProjectManager && project.projectManager) {
        recipientsToAdd.push({
            type: 'cc',
            recipient: {
                displayName: project.projectManager.name,
                emailAddress: project.projectManager.email
            }
        });
    }

    // Team Members to CC
    if (currentSelection.addTeamMembers && project.teamMembers) {
        project.teamMembers.forEach(member => {
            recipientsToAdd.push({
                type: 'cc',
                recipient: {
                    displayName: member.name,
                    emailAddress: member.email
                }
            });
        });
    }

    // Client Group to TO
    if (currentSelection.addClientGroup && project.clientGroup) {
        recipientsToAdd.push({
            type: 'to',
            recipient: {
                displayName: project.clientGroup.name,
                emailAddress: project.clientGroup.email
            }
        });
    }

    // Contractors to CC
    if (currentSelection.addContractors && project.contractors) {
        project.contractors.forEach(contractor => {
            recipientsToAdd.push({
                type: 'cc',
                recipient: {
                    displayName: contractor.name,
                    emailAddress: contractor.email
                }
            });
        });
    }

    console.log('Adding recipients:', recipientsToAdd);

    // Add recipients
    for (const item of recipientsToAdd) {
        await addRecipient(item.type, item.recipient);
    }
}

function addRecipient(type, recipient) {
    return new Promise((resolve, reject) => {
        const recipientField = type === 'to' ?
            Office.context.mailbox.item.to :
            Office.context.mailbox.item.cc;

        recipientField.addAsync([recipient], function(result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                console.log(`Added ${recipient.displayName} to ${type}`);
                resolve();
            } else {
                console.error(`Failed to add recipient to ${type}:`, result.error.message);
                // Don't reject, just warn
                resolve();
            }
        });
    });
}

function setCustomProperties() {
    return new Promise((resolve, reject) => {
        const project = getProjectByCode(currentSelection.project);
        const emailType = getEmailTypeByCode(currentSelection.emailType);

        Office.context.mailbox.item.loadCustomPropertiesAsync(function(result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const customProps = result.value;

                customProps.set('ProjectCode', project.code);
                customProps.set('ProjectName', project.name);
                customProps.set('EmailType', emailType.code);
                customProps.set('EmailTypeName', emailType.name);
                customProps.set('Priority', emailType.priority);

                customProps.saveAsync(function(saveResult) {
                    if (saveResult.status === Office.AsyncResultStatus.Succeeded) {
                        console.log('Custom properties saved');
                        resolve();
                    } else {
                        console.warn('Warning: Could not save custom properties');
                        resolve(); // Don't fail the whole operation
                    }
                });
            } else {
                console.warn('Warning: Could not load custom properties');
                resolve();
            }
        });
    });
}

function clearForm() {
    document.getElementById('projectSelect').value = '';
    document.getElementById('emailTypeSelect').value = '';
    document.getElementById('customSubject').value = '';
    document.getElementById('addProjectManager').checked = false;
    document.getElementById('addTeamMembers').checked = false;
    document.getElementById('addClientGroup').checked = false;
    document.getElementById('addContractors').checked = false;

    currentSelection = {
        project: '',
        emailType: '',
        customSubject: '',
        addProjectManager: false,
        addTeamMembers: false,
        addClientGroup: false,
        addContractors: false
    };

    document.getElementById('applyBtn').disabled = true;
    updateRecipientInfo();
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
