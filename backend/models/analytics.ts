import mongoose, { Schema, Document } from 'mongoose'

interface CityStats {
    clicks: number
    uniqueUsers: number
}

interface RegionStats {
    country: string
    clicks: number
    uniqueUsers: number
    cities: Map<string, CityStats>
}

interface DateStats {
    clicks: number
    uniqueUsers: number
}

interface ReferrerStats {
    clicks: number
    uniqueUsers: number
}

interface AnalyticsDoc extends Document {
    linkId: Schema.Types.ObjectId
    totalClicks: number
    uniqueUsers: string[]
    byDate: Map<string, DateStats>
    byRegion: Map<string, RegionStats>
    byReferrer: Map<string, ReferrerStats>
}

const analyticsSchema = new Schema<AnalyticsDoc>({
    linkId: { type: Schema.Types.ObjectId, ref: 'Link', required: true, unique: true },
    totalClicks: { type: Number, default: 0 },
    uniqueUsers: { type: [String], default: [] },
    byDate: {
        type: Map,
        of: {
            clicks: { type: Number, default: 0 },
            uniqueUsers: { type: Number, default: 0 }
        }, default: {}
    },
    byRegion: {
        type: Map,
        of: {
            country: { type: String, required: true },
            clicks: { type: Number, default: 0 },
            uniqueUsers: { type: Number, default: 0 },
            cities: {
                type: Map,
                of: {
                    clicks: { type: Number, default: 0 },
                    uniqueUsers: { type: Number, default: 0 }
                }, default: {}
            }
        }, default: {}
    },
    byReferrer: {
        type: Map,
        of: {
            clicks: { type: Number, default: 0 },
            uniqueUsers: { type: Number, default: 0 }
        }, default: {}
    }
}, { timestamps: true })

const Analytics = mongoose.model<AnalyticsDoc>('Analytics', analyticsSchema)

export { Analytics, AnalyticsDoc }