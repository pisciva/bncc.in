'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, FileText, Users, Lock, AlertCircle, Scale, Mail, BarChart3, Eye, Database } from 'lucide-react'

export default function TermsOfService() {
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
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-[#0054A5]">
                                Terms of Service
                            </h1>
                            <p className="text-[#64748B] text-sm mt-1">
                                Last updated: November 24, 2025
                            </p>
                        </div>
                    </div>
                    <p className="text-[#64748B] text-base sm:text-lg font-medium">
                        Welcome to BNCC.in! By using our URL shortening and analytics service, you agree to comply with and be bound by the following terms and conditions.
                    </p>
                </div>

                <div className="space-y-6">
                    <Section
                        icon={<Shield className="w-6 h-6" />}
                        title="1. Acceptance of Terms"
                        content={
                            <>
                                <p>
                                    By accessing and using BNCC.in ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<FileText className="w-6 h-6" />}
                        title="2. Description of Service"
                        content={
                            <>
                                <p className="mb-3">
                                    BNCC.in provides a comprehensive URL shortening and analytics service that allows users to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-[#64748B] ml-4">
                                    <li>Create shortened URLs from long web addresses</li>
                                    <li>Generate customizable QR codes for links</li>
                                    <li>Protect links with 6-digit password codes</li>
                                    <li>Set expiration dates for time-limited links</li>
                                    <li>Track and manage created links through a user dashboard</li>
                                    <li><strong>Access comprehensive analytics</strong> including:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>Real-time click tracking and unique visitor counts</li>
                                            <li>Time-based analytics with customizable date ranges</li>
                                            <li>Geographic distribution data (country and city level)</li>
                                            <li>Traffic source analysis (referrer tracking)</li>
                                            <li>Interactive charts and data visualizations</li>
                                        </ul>
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    <Section
                        icon={<Users className="w-6 h-6" />}
                        title="3. User Accounts and Dashboard Access"
                        content={
                            <>
                                <p className="mb-3">
                                    When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-[#64748B] ml-4">
                                    <li>Maintaining the confidentiality of your account credentials</li>
                                    <li>All activities that occur under your account</li>
                                    <li>The security of your analytics dashboard access</li>
                                    <li>Notifying us immediately of any unauthorized use</li>
                                    <li>Ensuring the accuracy of links and data you create</li>
                                </ul>
                                <p className="mt-3">
                                    Your dashboard provides access to sensitive analytics data. You agree to keep your login credentials secure and not share dashboard access with unauthorized parties.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<BarChart3 className="w-6 h-6" />}
                        title="4. Analytics Dashboard and Data Collection"
                        content={
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">A. Analytics Features</h3>
                                        <p className="mb-2">By using our analytics dashboard, you acknowledge and agree that:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>We collect aggregated click data and visitor statistics for your shortened links</li>
                                            <li>Analytics include click counts, unique visitors, geographic data, and traffic sources</li>
                                            <li>Data is displayed through interactive charts and time-based visualizations</li>
                                            <li>Analytics data is private and only accessible to the link owner</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">B. Data Privacy and Visitor Tracking</h3>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>We track anonymous visitor data using cryptographically hashed identifiers (SHA-256)</li>
                                            <li>IP addresses are hashed before storage and never stored in plain text</li>
                                            <li>Geographic data is derived from IP addresses using geolocation services</li>
                                            <li>No personally identifiable information (PII) is collected from link visitors</li>
                                            <li>Visitors to your shortened links are subject to this data collection for analytics purposes</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">C. Your Responsibilities as Link Owner</h3>
                                        <p className="mb-2">When sharing shortened links with analytics tracking, you agree to:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Inform visitors (if legally required) that analytics data is being collected</li>
                                            <li>Use analytics data responsibly and in compliance with applicable privacy laws</li>
                                            <li>Not attempt to identify individual users from aggregated analytics data</li>
                                            <li>Not share or sell analytics data to third parties without visitor consent</li>
                                            <li>Comply with GDPR, CCPA, and other relevant data protection regulations in your jurisdiction</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">D. Analytics Data Retention</h3>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Analytics data is stored indefinitely while your account remains active</li>
                                            <li>Account deletion will remove all links and their analytics permanently</li>
                                            <li>You can export analytics data at any time through your dashboard</li>
                                        </ul>
                                    </div>
                                </div>
                            </>
                        }
                    />

                    <Section
                        icon={<AlertCircle className="w-6 h-6" />}
                        title="5. Acceptable Use Policy"
                        content={
                            <>
                                <p className="mb-3">
                                    You agree NOT to use the Service to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-[#64748B] ml-4">
                                    <li>Share malicious, fraudulent, or illegal content</li>
                                    <li>Distribute spam, phishing, or scam links</li>
                                    <li>Violate intellectual property rights</li>
                                    <li>Share content containing malware or viruses</li>
                                    <li>Harass, abuse, or harm others</li>
                                    <li>Impersonate any person or entity</li>
                                    <li>Violate any applicable laws or regulations</li>
                                    <li>Manipulate or artificially inflate analytics data (click fraud)</li>
                                    <li>Scrape or harvest analytics data from other users</li>
                                    <li>Attempt to circumvent rate limiting or security measures</li>
                                    <li>Use analytics data to identify or track individual visitors without consent</li>
                                </ul>
                                <p className="mt-3 text-red-500 font-semibold">
                                    Violation of this policy may result in immediate termination of your account, links, and all associated analytics data.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<Lock className="w-6 h-6" />}
                        title="6. Link Management and Security"
                        content={
                            <>
                                <ul className="list-disc list-inside space-y-2 text-[#64748B]">
                                    <li>Links may be set to expire after a specified date</li>
                                    <li>Password-protected links use 6-digit codes with rate limiting (5 attempts per 3 hours)</li>
                                    <li>Inactive links may be removed after prolonged periods of non-use</li>
                                    <li>We reserve the right to disable or remove any link that violates our terms</li>
                                    <li>Custom URLs are subject to availability and our approval</li>
                                    <li>Analytics data continues to be collected until link expiration or deletion</li>
                                    <li>You are responsible for the destination content of your shortened links</li>
                                </ul>
                            </>
                        }
                    />

                    <Section
                        icon={<Eye className="w-6 h-6" />}
                        title="7. Privacy and Data Collection"
                        content={
                            <>
                                <p className="mb-3">
                                    We collect and process data as described in our Privacy Policy, including:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-[#64748B] ml-4">
                                    <li><strong>Account Information:</strong> Name, email, password (hashed)</li>
                                    <li><strong>Link Data:</strong> Original URLs, custom URLs, QR codes, settings</li>
                                    <li><strong>Analytics Data:</strong> Click counts, unique visitors (hashed), geographic data, referrer sources</li>
                                    <li><strong>Usage Data:</strong> Dashboard access patterns, chart preferences</li>
                                    <li><strong>Technical Data:</strong> IP addresses (hashed), timestamps, user agents</li>
                                </ul>
                                <p className="mt-3">
                                    For comprehensive details on how we collect, use, and protect your data and visitor analytics, please review our <Link href="/privacy-policy" className="text-[#0054A5] font-semibold hover:underline">Privacy Policy</Link>.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<Database className="w-6 h-6" />}
                        title="8. Data Ownership and Your Rights"
                        content={
                            <>
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">A. Your Data Ownership</h3>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>You retain ownership of links and associated analytics data you create</li>
                                            <li>You can export or download your analytics data at any time</li>
                                            <li>Analytics data is yours to use in compliance with applicable laws</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">B. Our Rights</h3>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>We may use aggregated, anonymized data for service improvement</li>
                                            <li>We reserve the right to delete data associated with Terms violations</li>
                                            <li>We may retain backup copies for disaster recovery purposes</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#0054A5] mb-2">C. Data Portability</h3>
                                        <p>You have the right to request a copy of all your data, including links and analytics, in a machine-readable format.</p>
                                    </div>
                                </div>
                            </>
                        }
                    />

                    <Section
                        icon={<Scale className="w-6 h-6" />}
                        title="9. Disclaimer of Warranties"
                        content={
                            <>
                                <p className="mb-3">
                                    The Service, including analytics features, is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-[#64748B] ml-4">
                                    <li>Uninterrupted or error-free service operation</li>
                                    <li>Accuracy, completeness, or reliability of links and analytics data</li>
                                    <li>Availability of analytics dashboards and charts</li>
                                    <li>Precision of geographic data or referrer information</li>
                                    <li>Real-time accuracy of click counts and visitor statistics</li>
                                    <li>Fitness for a particular purpose</li>
                                </ul>
                                <p className="mt-3">
                                    We do not guarantee the availability, functionality, or accuracy of shortened URLs, QR codes, or analytics data at all times. Analytics may be subject to delays or inaccuracies.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<Shield className="w-6 h-6" />}
                        title="10. Limitation of Liability"
                        content={
                            <>
                                <p>
                                    To the maximum extent permitted by law, BNCC.in and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-[#64748B] ml-4 mt-3">
                                    <li>Your use or inability to use the Service or analytics dashboard</li>
                                    <li>Inaccurate or incomplete analytics data</li>
                                    <li>Loss of analytics data or historical statistics</li>
                                    <li>Unauthorized access to your account or analytics data</li>
                                    <li>Errors, bugs, or omissions in the Service or analytics features</li>
                                    <li>Decisions made based on analytics data provided</li>
                                    <li>Third-party claims related to analytics data collection</li>
                                </ul>
                            </>
                        }
                    />

                    <Section
                        icon={<AlertCircle className="w-6 h-6" />}
                        title="12. Termination"
                        content={
                            <>
                                <p className="mb-3">
                                    We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
                                </p>
                                <p className="mb-3">
                                    Upon termination:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-[#64748B] ml-4">
                                    <li>Your right to use the Service will immediately cease</li>
                                    <li>All your shortened links will be deactivated</li>
                                    <li>Your analytics dashboard will become inaccessible</li>
                                    <li>All analytics data will be scheduled for deletion</li>
                                    <li>QR codes will no longer redirect to destination URLs</li>
                                </ul>
                                <p className="mt-3">
                                    You may voluntarily terminate your account at any time through your dashboard settings. Upon voluntary termination, all data will be deleted in accordance with our Privacy Policy.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<Scale className="w-6 h-6" />}
                        title="13. Governing Law"
                        content={
                            <>
                                <p>
                                    These Terms shall be governed and construed in accordance with the laws of Indonesia, without regard to its conflict of law provisions. Any disputes arising from the use of analytics data or service features shall be subject to the exclusive jurisdiction of Indonesian courts.
                                </p>
                            </>
                        }
                    />

                    <Section
                        icon={<Mail className="w-6 h-6" />}
                        title="14. Contact Information"
                        content={
                            <>
                                <p className="mb-3">
                                    If you have any questions about these Terms of Service, analytics features, or our practices, please contact us:
                                </p>
                                <div className="space-y-2 text-[#64748B]">
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
                        By using BNCC.in and its analytics dashboard features, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <Link href="/privacy-policy" className="text-[#0054A5] font-semibold hover:underline text-sm">
                            Privacy Policy
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