
export const TourGuide = {
    Sidebar: {
        Welcome: {
            selector: "#sidebar-welcome",
            content: `
<b>Welcome to Inscend.</b><br/><br/>
This is your <b>Action Board</b> — your daily decision hub.<br/><br/>
Each card shows a recommended action, why it matters, the stock involved, and the money at risk.
`
        },
        ActionCards: {
            selector: "#sidebar-action-cards",
            content: `When you have added products, action cards would be generated for you.
Each card is an <b>action you can take right now</b>.<br/><br/>
Use <b>Apply Discount</b> to act instantly, or <b>Brainstorm</b> to ask questions like:<br/>
• How do I increase sales this week?<br/>
• What should I restock?
`
        },
        Brainstorm: {
            selector: "#brainstorm-btn",
            content: `
This is your <b>Brainstorm section</b>.<br/><br/>
This is where you interact with our AI agent to understand more about your business
`
        },
        Products: {
            selector: "#sidebar-products",
            content: `
This is your <b>Inventory</b>.<br/><br/>
Inventory data powers stock alerts and discount suggestions on your Action Board.
`
        },
        Sales: {
            selector: "#sidebar-sales",
            content: `
This is your <b>Sales</b> screen.<br/><br/>
Sales data helps Inscend spot slow products, missed revenue, and growth opportunities.
`
        },
        Customers: {
            selector: "#sidebar-customers",
            content: `
This is your <b>Customers</b> screen.<br/><br/>
Customer data powers follow-ups, retention actions, and revenue recovery.
`
        },
        Settings: {
            selector: "#sidebar-settings",
            content: `
Use <b>Settings</b> to connect your tools and data sources.<br/><br/>
Once connected, your data syncs automatically — no manual work.
`
        },
        Signout: {
            selector: "#sidebar-signout",
            content: `
You can sign out anytime here.
`
        },
    },

    Products: {
        Welcome: {
            selector: "#products-welcome",
            content: `
This is where we track what you have in stock.<br/><br/>
You will see:<br/>
• Product name<br/>
• Stock count<br/>
• Price<br/>
• Status<br/><br/>
Use <b>Add Product</b> for manual entry or <b>Import Product</b> to upload or sync data.
`
        },
    },

    Sales: {
        Welcome: {
            selector: "#sales-welcome",
            content: `
This is your sales activity.<br/><br/>
Track:<br/>
• Total sales<br/>
• Revenue this week<br/>
• Orders list<br/><br/>
Use <b>Add Sale</b> or <b>Import Sale</b> to get started.
`
        },
    },

    Customers: {
        Welcome: {
            selector: "#customers-welcome",
            content: `
This is everyone who has bought from you.<br/><br/>
Customers are grouped into segments like:<br/>
• Active<br/>
• Dormant<br/>
• VIP<br/>
• At Risk<br/><br/>
This data helps Inscend suggest follow-ups and retention actions.
`
        },
    },

    Settings: {
        Welcome: {
            selector: "#settings-welcome",
            content: `
Welcome to the settings page where you can update profile data and integrate tools into your business setup.
`
        },
        Profile: {
            selector: "#settings-profile",
            content: `
Update information about your profile and business here, 
you can also choose to restart your tour by clicking the
<b>Restart Tour</b> button.
`
        },
        Integrations: {
            selector: "#settings-integrations",
            content: `
Connect your tools here.<br/><br/>
<b>Shopify</b> gives you one-click import for products, customers, and orders.<br/><br/>
Once connected, your data stays in sync automatically.
`
        },
    },
}

const RestartTour = {
    selector: "#sidebar-settings",
    content: `
If you ever want to revisit all the tours, go to <b>Settings</b>, open your profile, and click <b>Restart Tours</b>.
`
}

export const WelcomeGuide = [
    ...Object.values(TourGuide.Sidebar),
    RestartTour
]

export const ProductsGuide = [
    ...Object.values(TourGuide.Products),
    // RestartTour
]

export const SalesGuide = [
    ...Object.values(TourGuide.Sales),
    // RestartTour
]

export const CustomersGuide = [
    ...Object.values(TourGuide.Customers),
    // RestartTour
]

export const SettingsGuide = [
    ...Object.values(TourGuide.Settings),
    // RestartTour
]

export const tourMapping = {
    overview: WelcomeGuide,
    products: ProductsGuide,
    sales: SalesGuide,
    customers: CustomersGuide,
    settings: SettingsGuide,
} as const