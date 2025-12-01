'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Database, Lock, Cookie, UserCheck, Globe, Mail, Bell, BarChart3 } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-[#F8FAFC] px-6 lg:px-4 pt-30 pb-20 lg:py-30">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/"
                    className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/15 backdrop-blur-xl border border-white/30 rounded-full text-[#0054A5] font-semibold hover:bg-white/25 transition-all duration-300 shadow-7"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-1 p-8 sm:p-10 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#0054A5] to-[#003d7a] rounded-2xl flex items-center justify-center shadow-3">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-[#0054A5]">
                                Privacy Policy
                            </h1>
                            <p className="text-[#64748B] text-sm mt-1">
                                Last updated: November 24, 2025
                            </p>
                        </div>
                    </div>
                    <p className="text-[#64748B] text-base sm:text-lg font-medium">
                        At BNCC.in, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our URL shortening service and analytics dashboard.
                    </p>
                </div>

                <div className="space-y-6">
                    <Section
                        icon={<Database className="w-6 h-6" />}
                        title="1. Information We Collect"
                        content={
                            <>
                                <p className="mb-4 font-semibold text-[#0054A5]">
                                    We collect several types of information from and about users of our Service:
                                </p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">A. Personal Information</h3>
                                        <p className="mb-2">When you create an account, we collect:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Full name</li>
                                            <li>Email address</li>
                                            <li>Password (encrypted using industry-standard hashing)</li>
                                            <li>Profile information (if provided)</li>
                                            <li>Authentication tokens for third-party sign-in (Google, GitHub)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">B. Link Information</h3>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Original URLs you shorten</li>
                                            <li>Custom short URLs you create</li>
                                            <li>Link titles and descriptions</li>
                                            <li>QR code settings and generated QR codes</li>
                                            <li>Password protection settings</li>
                                            <li>Link expiration dates</li>
                                            <li>Link creation and modification timestamps</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">C. Analytics and Usage Data</h3>
                                        <p className="mb-2">When someone clicks on your shortened links, we automatically collect and process:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Click data:</strong> Total clicks and unique visitor counts</li>
                                            <li><strong>IP addresses:</strong> Hashed for privacy to identify unique users</li>
                                            <li><strong>Geographic data:</strong> Country and city-level location (derived from IP)</li>
                                            <li><strong>Referrer information:</strong> Source platform or website (e.g., Instagram, Facebook, Direct)</li>
                                            <li><strong>Time-based data:</strong> Click timestamps and date-based statistics</li>
                                            <li><strong>Access patterns:</strong> Click frequency and engagement metrics</li>
                                        </ul>
                                        <p className="mt-3 text-sm bg-[#0054A5]/5 border border-[#0054A5]/20 rounded-lg p-3">
                                            <strong>Privacy Note:</strong> All user identifiers are cryptographically hashed using SHA-256 to protect visitor privacy while allowing accurate unique visitor counting.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">D. Dashboard and Account Activity</h3>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Dashboard access logs and usage patterns</li>
                                            <li>Chart type and date range preferences</li>
                                            <li>Link management activities (create, edit, delete)</li>
                                            <li>QR code downloads and exports</li>
                                        </ul>
                                    </div>
                                </div>
                            </>
                        }
                    />

                    <Section
                        icon={<BarChart3 className="w-6 h-6" />}
                        title="2. Analytics Dashboard Features"
                        content={
                            <>
                                <p className="mb-3">Our analytics dashboard provides comprehensive insights about your shortened links:</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">A. Real-Time Analytics</h3>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Total clicks and unique visitors for each link</li>
                                            <li>Time-series data showing click trends over customizable date ranges</li>
                                            <li>Geographic distribution (country and city level)</li>
                                            <li>Referrer source breakdown (social media, search engines, direct traffic)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">B. Data Visualization</h3>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Interactive charts with multiple view options (clicks vs. unique visitors)</li>
                                            <li>Time-based line charts for trend analysis</li>
                                            <li>Geographic bar charts for location insights</li>
                                            <li>Referrer pie charts for traffic source analysis</li>
                                            <li>Customizable date range filters</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">C. Data Accuracy & Privacy</h3>
                                        <p className="mb-2">We ensure analytics accuracy while protecting visitor privacy:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>IP addresses are hashed before storage (not stored in plain text)</li>
                                            <li>Unique visitors are tracked using privacy-preserving hash algorithms</li>
                                            <li>No personally identifiable information (PII) is stored for link visitors</li>
                                            <li>Analytics data is only accessible to the link owner</li>
                                            <li>Data aggregation prevents identification of individual users</li>
                                        </ul>
                                    </div>
                                </div>
                            </>
                        }
                    />

                    <Section
                        icon={<Eye className="w-6 h-6" />}
                        title="3. How We Use Your Information"
                        content={
                            <>
                                <p className="mb-3">We use the information we collect for the following purposes:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Service Provision:</strong> To create, manage, and maintain your shortened links and QR codes</li>
                                    <li><strong>Account Management:</strong> To create and manage your user account and authentication</li>
                                    <li><strong>Analytics Generation:</strong> To collect, process, and display comprehensive link performance analytics in your dashboard</li>
                                    <li><strong>Geographic Insights:</strong> To provide location-based analytics using IP geolocation</li>
                                    <li><strong>Traffic Analysis:</strong> To identify referrer sources and analyze traffic patterns</li>
                                    <li><strong>Rate Limiting:</strong> To prevent abuse and protect links with password protection</li>
                                    <li><strong>Communication:</strong> To send you service-related notifications, password resets, and important updates</li>
                                    <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
                                    <li><strong>Improvement:</strong> To analyze usage patterns and improve our Service features</li>
                                    <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</li>
                                </ul>
                            </>
                        }
                    />

                    <Section
                        icon={<Globe className="w-6 h-6" />}
                        title="4. How We Share Your Information"
                        content={
                            <>
                                <p className="mb-3">We do not sell your personal information. We may share your information in the following circumstances:</p>
                                
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">A. With Your Consent</h3>
                                        <p>We may share your information when you explicitly consent to such sharing.</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">B. Service Providers</h3>
                                        <p>We may share information with third-party service providers who perform services on our behalf, such as:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                                            <li>Cloud hosting providers (MongoDB Atlas for database)</li>
                                            <li>Email delivery services (for password resets and notifications)</li>
                                            <li>Authentication providers (Google OAuth, GitHub OAuth)</li>
                                            <li>IP geolocation services (GeoIP-lite for location data)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">C. Analytics Data Visibility</h3>
                                        <p>Analytics data for your links is:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                                            <li>Only accessible to you (the link owner) through your private dashboard</li>
                                            <li>Never shared with other users or third parties</li>
                                            <li>Aggregated and anonymized to protect visitor privacy</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">D. Legal Requirements</h3>
                                        <p>We may disclose your information if required by law or in response to:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                                            <li>Legal processes or government requests</li>
                                            <li>Enforcement of our Terms of Service</li>
                                            <li>Protection of rights, property, or safety</li>
                                            <li>Investigation of fraud or security incidents</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">E. Business Transfers</h3>
                                        <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>
                                    </div>
                                </div>
                            </>
                        }
                    />

                    <Section
                        icon={<Lock className="w-6 h-6" />}
                        title="5. Data Security"
                        content={
                            <>
                                <p className="mb-3">
                                    We implement appropriate technical and organizational measures to protect your personal information, including:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Encryption:</strong> All data transmitted between your browser and our servers uses HTTPS/TLS encryption</li>
                                    <li><strong>Password Security:</strong> Passwords are hashed using bcrypt with salt before storage</li>
                                    <li><strong>Privacy Protection:</strong> IP addresses are hashed using SHA-256 for analytics tracking</li>
                                    <li><strong>Access Control:</strong> Authentication required for dashboard and analytics access</li>
                                    <li><strong>Rate Limiting:</strong> Protection against brute force attacks and abuse</li>
                                    <li><strong>Secure Database:</strong> MongoDB with access controls and encryption at rest</li>
                                    <li><strong>Session Management:</strong> JWT tokens with expiration for authenticated sessions</li>
                                    <li><strong>Regular Updates:</strong> Security patches and dependency updates</li>
                                </ul>
                                <p className="mt-3 text-amber-600 font-semibold">
                                    However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information using industry-standard security practices, we cannot guarantee absolute security.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<Cookie className="w-6 h-6" />}
                        title="6. Cookies and Tracking Technologies"
                        content={
                            <>
                                <p className="mb-3">We use cookies and similar tracking technologies to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality (JWT tokens)</li>
                                    <li><strong>Analytics Tracking:</strong> To collect click data and generate statistics for your links</li>
                                    <li><strong>Preference Cookies:</strong> To remember your dashboard settings and chart preferences</li>
                                    <li><strong>Security Cookies:</strong> For rate limiting and protection against abuse</li>
                                </ul>
                                <p className="mt-3">
                                    You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our Service, including authentication and analytics features.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<Database className="w-6 h-6" />}
                        title="7. Data Retention"
                        content={
                            <>
                                <p className="mb-3">We retain your information for as long as necessary to:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide our services to you</li>
                                    <li>Maintain analytics history for your links</li>
                                    <li>Comply with legal obligations</li>
                                    <li>Resolve disputes and enforce agreements</li>
                                </ul>
                                <div className="mt-3 space-y-2">
                                    <p><strong>Account Deletion:</strong> When you delete your account, we will:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Delete your personal information (name, email, password)</li>
                                        <li>Delete all your shortened links and associated QR codes</li>
                                        <li>Delete all analytics data associated with your links</li>
                                        <li>Remove authentication tokens and session data</li>
                                    </ul>
                                    <p className="mt-2"><strong>Link Expiration:</strong> Links with expiration dates will be automatically disabled after expiry, and their analytics data will be retained for historical purposes unless you delete the link.</p>
                                </div>
                            </>
                        }
                    />

                    <Section
                        icon={<UserCheck className="w-6 h-6" />}
                        title="8. Your Privacy Rights"
                        content={
                            <>
                                <p className="mb-3">You have the following rights regarding your personal information:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong>Access:</strong> Request a copy of your personal information and analytics data</li>
                                    <li><strong>Correction:</strong> Update or correct inaccurate information through your account settings</li>
                                    <li><strong>Deletion:</strong> Request deletion of your personal information and all associated data</li>
                                    <li><strong>Export:</strong> Download your links and analytics data in a portable format</li>
                                    <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications (we only send essential service emails)</li>
                                    <li><strong>Object:</strong> Object to certain processing of your data</li>
                                    <li><strong>Analytics Control:</strong> Delete individual links to remove their associated analytics data</li>
                                </ul>
                                <p className="mt-3">
                                    To exercise these rights, please contact us at <Link href="mailto:rnd@bncc.net" className="text-[#0054A5] font-semibold hover:underline">rnd@bncc.net</Link> or manage your data through your dashboard settings.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<Globe className="w-6 h-6" />}
                        title="9. Third-Party Links"
                        content={
                            <>
                                <p className="mb-2">
                                    Our Service facilitates access to third-party websites through shortened links. We are not responsible for:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>The privacy practices of destination websites</li>
                                    <li>Content on external sites accessed through our links</li>
                                    <li>Data collection by third-party websites</li>
                                </ul>
                                <p className="mt-3">
                                    We encourage you to review the privacy policies of any third-party sites you visit. We only track aggregate data about link clicks, not user behavior on destination sites.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<Bell className="w-6 h-6" />}
                        title="10. Changes to This Privacy Policy"
                        content={
                            <>
                                <p className="mb-3">
                                    We may update this Privacy Policy from time to time to reflect changes in our practices, features, or legal requirements. We will notify you of any material changes by:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Posting the updated Privacy Policy on this page</li>
                                    <li>Updating the "Last updated" date at the top</li>
                                    <li>Sending you an email notification for significant changes</li>
                                    <li>Displaying a notice in your dashboard</li>
                                </ul>
                                <p className="mt-3">
                                    Your continued use of the Service after changes become effective constitutes acceptance of the revised Privacy Policy. We encourage you to review this policy periodically.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<Mail className="w-6 h-6" />}
                        title="11. Contact Information"
                        content={
                            <>
                                <p className="mb-3">
                                    If you have any questions, concerns, or requests regarding this Privacy Policy, analytics features, or our privacy practices, please contact us:
                                </p>
                                <div className="space-y-2">
                                    <p><strong>Email:</strong> <Link href="mailto:rnd@bncc.net" className="text-[#0054A5] hover:underline">rnd@bncc.net</Link></p>
                                    <p><strong>Website:</strong> <Link href="https://www.bncc.net" target="_blank" rel="noopener noreferrer" className="text-[#0054A5] hover:underline">www.bncc.net</Link></p>
                                    <p><strong>Address:</strong> Jalan Rawa Belong No.51A, Kec. Palmerah, Kota Jakarta Barat, Indonesia</p>
                                </div>
                            </>
                        }
                    />
                </div>

                <div className="mt-10 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-1 p-6 text-center">
                    <p className="text-[#64748B] text-sm">
                        By using BNCC.in and its analytics features, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <Link href="/terms-of-service" className="text-[#0054A5] font-semibold hover:underline text-sm">
                            Terms of Service
                        </Link>
                        <span className="text-[#64748B]">•</span>
                        <Link href="/" className="text-[#0054A5] font-semibold hover:underline text-sm">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

function Section({ icon, title, content }: { icon: React.ReactNode; title: string; content: React.ReactNode }) {
    return (
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2 p-6 sm:p-8 hover:shadow-9 transition-all duration-300">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0054A5]/10 to-[#003d7a]/5 rounded-xl flex items-center justify-center text-[#0054A5] flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0054A5] mb-4">
                        {title}
                    </h2>
                    <div className="text-[#64748B] text-sm sm:text-base space-y-3">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    )
}