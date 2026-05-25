export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-[80vh] px-4 py-20 font-sans w-full">
            <div className="max-w-3xl mx-auto w-full bg-white dark:bg-zinc-950">
                <h1 className="text-4xl md:text-5xl font-black font-playfair mb-8 text-center text-zinc-900 dark:text-white">
                    PRIVACY POLICY
                </h1>

                <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">1. Introduction</h2>
                        <p>
                            Welcome to Streexpo. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our
                            website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">2. The Data We Collect</h2>
                        <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address, and telephone numbers.</li>
                            <li><strong>Financial Data:</strong> includes payment card details (processed securely via our payment providers).</li>
                            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">3. How We Use Your Data</h2>
                        <p>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal
                            data to process and deliver your order, manage our relationship with you, and send you details about
                            new drops and special offers (if you have opted in to receive them).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">4. Data Security</h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
                            used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those
                            employees, agents, contractors, and other third parties who have a business need to know.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">5. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact our
                            customer service team at <strong>support@streexpo.com</strong>.
                        </p>
                    </section>

                    <p className="text-xs text-zinc-400 mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                        Last updated: May 2026
                    </p>
                </div>
            </div>
        </div>
    );
}