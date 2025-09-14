import {
    XCircle,
    CheckCircle,
    CircleAlert
} from "lucide-react"

export const statuses = [
    {
        value: "UPTODATE",
        label: "Up To Date",
        icon: CheckCircle,
        bgcolor: '#27a743',
        fgcolor: '#FFFFFF'
    },
    {
        value: "NEAREXPIRY",
        label: "Near Expiry",
        icon: CircleAlert,
        bgcolor: '#fec107',
        fgcolor: '#282828'
    },
    {
        value: "EXPIRED",
        label: "Expired",
        icon: XCircle,
        bgcolor: '#9D4042',
        fgcolor: '#FFFFFF'
    },
]
