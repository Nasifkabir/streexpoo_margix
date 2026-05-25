import { PhoneCall, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 font-sans w-full">
            <div className="max-w-4xl w-full mx-auto">
                <h1 className="text-4xl md:text-5xl font-black font-playfair mb-12 text-center text-zinc-900 dark:text-white">
                    CONTACT US
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl w-full transition-transform hover:-translate-y-1 hover:shadow-xl">
                        <PhoneCall className="h-8 w-8 text-blue-600 mb-4" />
                        <h3 className="font-bold mb-2">Phone</h3>
                        <p className="text-zinc-500 text-sm">+880 1234 567890</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl w-full transition-transform hover:-translate-y-1 hover:shadow-xl">
                        <Mail className="h-8 w-8 text-blue-600 mb-4" />
                        <h3 className="font-bold mb-2">Email</h3>
                        <p className="text-zinc-500 text-sm">support@streexpo.com</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl w-full transition-transform hover:-translate-y-1 hover:shadow-xl">
                        <MapPin className="h-8 w-8 text-blue-600 mb-4" />
                        <h3 className="font-bold mb-2">Office</h3>
                        <p className="text-zinc-500 text-sm">Dhaka, Bangladesh</p>
                    </div>
                </div>
            </div>
        </div>
    );
}