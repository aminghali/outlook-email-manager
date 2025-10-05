/**
 * Email Manager Pro - Configuration File
 * 
 * This file contains all customizable settings for your company's email templates.
 * Modify this file to match your organization's projects, email types, and formatting preferences.
 */

const CONFIG = {
    // Company Information
    company: {
        name: "Your Company Name",
        supportEmail: "support@yourcompany.com",
        website: "https://yourcompany.com"
    },
    
    // Projects Configuration
    // Add or modify projects as needed for your organization
    projects: [
        { code: "PROJECT-001", name: "Alpha Initiative", active: true },
        { code: "PROJECT-002", name: "Beta Development", active: true },
        { code: "PROJECT-003", name: "Gamma Rollout", active: true },
        { code: "PROJECT-004", name: "Delta Integration", active: true },
        { code: "PROJECT-005", name: "Epsilon Platform", active: true },
        { code: "PROJECT-006", name: "Zeta Migration", active: true },
        { code: "PROJECT-007", name: "Eta Optimization", active: false }, // Set to false to hide
        { code: "INTERNAL", name: "Internal Communication", active: true },
        { code: "CLIENT", name: "Client Relations", active: true },
        { code: "VENDOR", name: "Vendor Management", active: true },
        { code: "HR", name: "Human Resources", active: true },
        { code: "FINANCE", name: "Finance & Accounting", active: true },
        { code: "LEGAL", name: "Legal Department", active: true },
        { code: "MARKETING", name: "Marketing Campaign", active: true },
        { code: "SALES", name: "Sales Opportunity", active: true }
    ],
    
    // Email Types Configuration
    // Customize the email types that appear in your dropdown
    emailTypes: [
        { 
            code: "UPDATE", 
            label: "Status Update", 
            priority: "Normal",
            icon: "📊",
            headerText: "Status Update"
        },
        { 
            code: "REQUEST", 
            label: "Action Request", 
            priority: "Normal",
            icon: "📝",
            headerText: "Action Required"
        },
        { 
            code: "MEETING", 
            label: "Meeting Invitation", 
            priority: "Normal",
            icon: "📅",
            headerText: "Meeting Request"
        },
        { 
            code: "FOLLOWUP", 
            label: "Follow-up", 
            priority: "Normal",
            icon: "🔄",
            headerText: "Follow-Up"
        },
        { 
            code: "REVIEW", 
            label: "Document Review", 
            priority: "Normal",
            icon: "📄",
            headerText: "Review Requested"
        },
        { 
            code: "APPROVAL", 
            label: "Approval Required", 
            priority: "High",
            icon: "✅",
            headerText: "Approval Needed"
        },
        { 
            code: "ANNOUNCEMENT", 
            label: "Announcement", 
            priority: "Normal",
            icon: "📢",
            headerText: "Important Announcement"
        },
        { 
            code: "REPORT", 
            label: "Report Submission", 
            priority: "Normal",
            icon: "📈",
            headerText: "Report Attached"
        },
        { 
            code: "URGENT", 
            label: "Urgent Matter", 
            priority: "High",
            icon: "🔴",
            headerText: "URGENT"
        },
        { 
            code: "FYI", 
            label: "FYI/Information", 
            priority: "Low",
            icon: "ℹ️",
            headerText: "For Your Information"
        },
        { 
            code: "INVOICE", 
            label: "Invoice/Payment", 
            priority: "Normal",
            icon: "💰",
            headerText: "Invoice Attached"
        },
        { 
            code: "SUPPORT", 
            label: "Support Request", 
            priority: "Normal",
            icon: "🆘",
            headerText: "Support Requested"
        }
    ],
    
    // Subject Line Format
    // Available variables: {project}, {type}, {custom}
    subjectFormat: "[{project}] {type}{custom}",
    
    // Email Header Configuration
    header: {
        // Include divider lines in header
        includeDividers: true,
        
        // Divider character (use unicode box-drawing characters for professional look)
        dividerChar: "━",
        dividerLength: 40,
        
        // Fields to include in header
        includeProject: true,
        includeType: true,
        includePriority: true,
        includeDate: true,
        includeTime: false,
        includeSender: false,
        
        // Date format options: 'short', 'long', 'iso'
        dateFormat: 'long',
        
        // Additional custom fields (optional)
        customFields: [
            // { label: "Department", value: "Engineering" },
            // { label: "Region", value: "North America" }
        ]
    },
    
    // Email Signature Template (optional)
    // Set to null if you don't want to add signatures
    signature: {
        enabled: false,
        template: `
--
Best regards,
{userName}
{userTitle}
{companyName}
{userEmail} | {userPhone}
        `
    },
    
    // Validation Rules
    validation: {
        // Require custom subject for certain email types
        requireCustomSubjectFor: ["URGENT", "APPROVAL"],
        
        // Maximum custom subject length
        maxCustomSubjectLength: 100,
        
        // Warn if email body is empty when applying template
        warnOnEmptyBody: true
    },
    
    // Integration Settings
    integration: {
        // Microsoft Teams integration
        teamsEnabled: false,
        
        // SharePoint document linking
        sharePointEnabled: false,
        
        // CRM system integration
        crmEnabled: false
    },
    
    // UI Customization
    ui: {
        // Primary brand color (hex code)
        primaryColor: "#0078d4",
        
        // Show emoji icons next to email types
        showEmojis: true,
        
        // Show preview box
        showPreview: true,
        
        // Default to last used project (requires local storage)
        rememberLastProject: true
    }
};

// Export configuration for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}