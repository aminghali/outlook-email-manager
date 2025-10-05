/* global Office */

let projectConfig = null;
let currentSelection = {
    project: '',
    emailType: ''
};
let suggestedProject = null;

Office.initialize = function (reason) {
    console.log('Office Add-in initialized (Read Mode)');

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
};

async function initializeApp() {
    console.log('initializeApp() called - Read Mode');

    // Load project configuration
    await loadProjectConfig();

    // Populate dropdowns
    populateProjectDropdown();
    populateEmailTypeDropdown();

    // Load email information
    await loadEmailInfo();

    // Get current categories
    await loadCurrentCategories();

    // Analyze and suggest project
    await analyzeAndSuggest();

    // Attach event listeners
    document.getElementById('projectSelect').addEventListener('change', handleSelectionChange);
    document.getElementById('emailTypeSelect').addEventListener('change', handleSelectionChange);
    document.getElementById('applyCategoriesBtn').addEventListener('click', applyCategories);
    document.getElementById('removeCategoriesBtn').addEventListener('click', removeAllCategories);
    document.getElementById('applySuggestionBtn').addEventListener('click', applySuggestion);

    console.log('App initialized successfully - Read Mode');
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

async function loadEmailInfo() {
    return new Promise((resolve) => {
        Office.context.mailbox.item.from.getAsync(function(result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const from = result.value;
                document.getElementById('emailFrom').textContent = `${from.displayName} <${from.emailAddress}>`;
            }

            Office.context.mailbox.item.subject.getAsync(function(subjectResult) {
                if (subjectResult.status === Office.AsyncResultStatus.Succeeded) {
                    document.getElementById('emailSubject').textContent = subjectResult.value;
                }
                resolve();
            });
        });
    });
}

async function loadCurrentCategories() {
    return new Promise((resolve) => {
        Office.context.mailbox.item.categories.getAsync(function(result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const categories = result.value;
                displayCurrentCategories(categories);
            }
            resolve();
        });
    });
}

function displayCurrentCategories(categories) {
    const container = document.getElementById('currentCategories');

    if (categories && categories.length > 0) {
        container.innerHTML = categories.map(cat =>
            `<span class="category-badge">${cat}</span>`
        ).join('');
    } else {
        container.innerHTML = '<span class="no-categories">No categories applied</span>';
    }
}

async function analyzeAndSuggest() {
    return new Promise((resolve) => {
        // Get subject and sender to analyze
        Office.context.mailbox.item.subject.getAsync(function(subjectResult) {
            if (subjectResult.status === Office.AsyncResultStatus.Succeeded) {
                const subject = subjectResult.value;

                // Analyze subject for project codes
                const suggestion = analyzeSubjectForProject(subject);

                if (suggestion) {
                    suggestedProject = suggestion;
                    showSuggestion(suggestion);
                }
            }
            resolve();
        });
    });
}

function analyzeSubjectForProject(subject) {
    if (!projectConfig || !subject) return null;

    // Check if subject contains project code in brackets [PROJECT-XXX]
    const bracketMatch = subject.match(/\[([^\]]+)\]/);
    if (bracketMatch) {
        const code = bracketMatch[1];
        const project = projectConfig.projects.find(p => p.code === code);
        if (project) {
            return {
                project: project,
                reason: `Subject contains project code [${code}]`
            };
        }
    }

    // Check if subject contains project name
    for (const project of projectConfig.projects) {
        const nameWords = project.name.toLowerCase().split(' ');
        const subjectLower = subject.toLowerCase();

        // Check if any significant word from project name is in subject
        for (const word of nameWords) {
            if (word.length > 4 && subjectLower.includes(word)) {
                return {
                    project: project,
                    reason: `Subject mentions "${word}" from project "${project.name}"`
                };
            }
        }
    }

    return null;
}

function showSuggestion(suggestion) {
    const suggestionBox = document.getElementById('suggestionBox');
    const suggestionText = document.getElementById('suggestionText');

    suggestionText.textContent = `Detected: ${suggestion.project.displayName}. ${suggestion.reason}`;
    suggestionBox.style.display = 'block';
}

function applySuggestion() {
    if (suggestedProject) {
        document.getElementById('projectSelect').value = suggestedProject.project.code;
        handleSelectionChange();
        document.getElementById('suggestionBox').style.display = 'none';
    }
}

function handleSelectionChange() {
    currentSelection.project = document.getElementById('projectSelect').value;
    currentSelection.emailType = document.getElementById('emailTypeSelect').value;

    console.log('Current selection:', currentSelection);

    // Update category preview
    updateCategoryPreview();

    // Enable/disable apply button
    const hasSelection = currentSelection.project || currentSelection.emailType;
    document.getElementById('applyCategoriesBtn').disabled = !hasSelection;
}

function updateCategoryPreview() {
    const categories = getCategoriesToApply();
    const categoryPreview = document.getElementById('categoryPreview');

    if (categories.length > 0) {
        categoryPreview.innerHTML = categories.map(cat =>
            `<span class="category-badge">${cat}</span>`
        ).join('');
    } else {
        categoryPreview.innerHTML = '<span class="no-categories">Select project or email type above</span>';
    }
}

function getCategoriesToApply() {
    const categories = [];

    if (currentSelection.project) {
        const project = projectConfig.projects.find(p => p.code === currentSelection.project);
        if (project) {
            categories.push(project.category);
        }
    }

    if (currentSelection.emailType) {
        const emailType = projectConfig.emailTypes.find(t => t.code === currentSelection.emailType);
        if (emailType) {
            categories.push(emailType.category);
        }
    }

    return categories;
}

async function applyCategories() {
    console.log('applyCategories() called');

    const btn = document.getElementById('applyCategoriesBtn');
    btn.disabled = true;
    btn.textContent = 'Applying...';

    try {
        const categories = getCategoriesToApply();
        if (categories.length === 0) {
            showStatus('No categories to apply', 'error');
            return;
        }

        console.log('Applying categories:', categories);

        // Ensure categories exist in master list
        await ensureCategoriesExist(categories);

        // Apply categories to item
        await applyCategoriestoItem(categories);

        // Reload current categories to show update
        await loadCurrentCategories();

        showStatus(`✓ Applied ${categories.length} categor${categories.length === 1 ? 'y' : 'ies'} successfully!`, 'success');
        console.log('Categories applied successfully');
    } catch (error) {
        console.error('Error applying categories:', error);
        showStatus('Error: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Apply Categories';
    }
}

function ensureCategoriesExist(categories) {
    return new Promise((resolve, reject) => {
        Office.context.mailbox.masterCategories.getAsync(function(result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const existingCategories = result.value.map(cat => cat.displayName);
                const categoriesToCreate = [];

                categories.forEach((catName, index) => {
                    if (!existingCategories.includes(catName)) {
                        categoriesToCreate.push({
                            displayName: catName,
                            color: Office.MailboxEnums.CategoryColor['Preset' + (index % 25)]
                        });
                    }
                });

                if (categoriesToCreate.length > 0) {
                    Office.context.mailbox.masterCategories.addAsync(categoriesToCreate, function(addResult) {
                        if (addResult.status === Office.AsyncResultStatus.Succeeded) {
                            console.log('Categories created in master list');
                            resolve();
                        } else {
                            console.warn('Warning: Could not create categories:', addResult.error.message);
                            resolve(); // Continue anyway
                        }
                    });
                } else {
                    resolve();
                }
            } else {
                console.warn('Warning: Could not get master categories');
                resolve();
            }
        });
    });
}

function applyCategoriestoItem(categories) {
    return new Promise((resolve, reject) => {
        Office.context.mailbox.item.categories.addAsync(categories, function(result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                console.log('Categories applied to item');
                resolve();
            } else {
                reject(new Error('Failed to apply categories: ' + result.error.message));
            }
        });
    });
}

async function removeAllCategories() {
    console.log('removeAllCategories() called');

    const btn = document.getElementById('removeCategoriesBtn');
    btn.disabled = true;
    btn.textContent = 'Removing...';

    try {
        // Get current categories first
        const currentCategories = await new Promise((resolve) => {
            Office.context.mailbox.item.categories.getAsync(function(result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    resolve(result.value);
                } else {
                    resolve([]);
                }
            });
        });

        if (currentCategories.length === 0) {
            showStatus('No categories to remove', 'error');
            return;
        }

        // Remove all categories
        await new Promise((resolve, reject) => {
            Office.context.mailbox.item.categories.removeAsync(currentCategories, function(result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    resolve();
                } else {
                    reject(new Error('Failed to remove categories: ' + result.error.message));
                }
            });
        });

        // Reload display
        await loadCurrentCategories();

        showStatus('✓ All categories removed successfully!', 'success');
        console.log('Categories removed successfully');
    } catch (error) {
        console.error('Error removing categories:', error);
        showStatus('Error: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Remove All Categories';
    }
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
