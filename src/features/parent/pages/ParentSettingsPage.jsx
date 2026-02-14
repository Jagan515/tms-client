import { useSelector } from "react-redux";
import PageHeader from "../../../components/common/PageHeader";
import ParentSettings from "../components/ParentSettings";

function ParentSettingsPage() {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="animate-fade-in" style={{ padding: 'var(--s-6)' }}>
            <PageHeader
                title="Preferences"
                subtitle="Manage your guardian account and notification settings"
            />
            <ParentSettings user={user} />
        </div>
    );
}

export default ParentSettingsPage;
