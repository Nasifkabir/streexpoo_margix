export default function TermsPage() {
    return (
        <div className="min-h-[80vh] px-4 py-20 font-sans w-full">
            <div className="max-w-3xl mx-auto w-full bg-white dark:bg-zinc-950">
                <h1 className="text-4xl md:text-5xl font-black font-playfair mb-8 text-center text-zinc-900 dark:text-white">
                    TERMS & CONDITIONS
                </h1>

                <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">1. Agreement to Terms</h2>
                        <p>
                            By accessing our website and purchasing products from Streexpo, you agree to be bound by these
                            Terms and Conditions. If you do not agree with any part of these terms, you are prohibited from
                            using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">2. Products and Pricing</h2>
                        <p>
                            We strive to display our products and their colors as accurately as possible. However, we cannot
                            guarantee that your computer monitor's display of any color will be completely accurate. All descriptions
                            of products or product pricing are subject to change at any time without notice, at our sole discretion.
                            We reserve the right to discontinue any product at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">3. Orders and Cancellation</h2>
                        <p>
                            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or
                            cancel quantities purchased per person, per household, or per order. If we make a change to or cancel
                            an order, we will attempt to notify you by contacting the email and/or billing phone number provided
                            at the time the order was made.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">4. Return Policy</h2>
                        <p>
                            Our refund and returns policy lasts 30 days. If 30 days have passed since your purchase, we can’t offer
                            you a full refund or exchange. To be eligible for a return, your item must be unused and in the same
                            condition that you received it. It must also be in the original packaging.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">5. Governing Law</h2>
                        <p>
                            These Terms and Conditions and any separate agreements whereby we provide you services shall be governed
                            by and construed in accordance with the laws of Bangladesh.
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