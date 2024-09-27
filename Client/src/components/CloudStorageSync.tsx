'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function CloudStorageSync() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Cloud Storage Sync</h2>
            <div className="flex items-center justify-between">
                <span>OneDrive</span>
                <Switch />
            </div>
            <div className="flex items-center justify-between">
                <span>Google Drive</span>
                <Switch />
            </div>
            <div className="flex items-center justify-between">
                <span>Dropbox</span>
                <Switch />
            </div>
            <Button>Sync Now</Button>
        </div>
    )
}