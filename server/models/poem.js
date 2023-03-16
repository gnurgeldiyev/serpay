const { Schema } = require('mongoose')

const poemSchema = Schema(
    {
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Poet',
            required: true,
        },
        year: {
            type: String,
            default: null,
        },
        content: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            default: null,
        },
        youtube_link: {
            type: String,
            default: null,
        },
        category: {
            type: Array,
            default: null,
        },
        added_by: {
            type: Schema.Types.ObjectId,
            ref: 'Editor',
            required: true,
        },
        is_approved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
)

module.exports = poemSchema
