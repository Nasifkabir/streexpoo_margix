import { SettingsForm } from "@/components/settings-form";
import connectToDatabase from "@/lib/db";
import StoreSettings from "@/models/StoreSettings";

export default async function SettingsPage() {
  await connectToDatabase();
  
  let settings = await StoreSettings.findOne({});
  
  if (!settings) {
    settings = await StoreSettings.create({});
  }

  // Need to parse stringify to pass to client component safely
  const serializedSettings = JSON.parse(JSON.stringify(settings));

  return (
    <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Store Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Configure global details for the E-Commerce Storefront.</p>
      </div>
      
      <SettingsForm initialData={serializedSettings} />
    </div>
  );
}
