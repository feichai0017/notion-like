'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function SettingsPage() {
    const [isDarkMode, setIsDarkMode] = React.useState(false)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <Switch
                            id="dark-mode"
                            checked={isDarkMode}
                            onCheckedChange={setIsDarkMode}
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Cloud Storage Sync</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="onedrive-sync">OneDrive</Label>
                        <Switch id="onedrive-sync" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="gdrive-sync">Google Drive</Label>
                        <Switch id="gdrive-sync" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="dropbox-sync">Dropbox</Label>
                        <Switch id="dropbox-sync" />
                    </div>
                    <Button className="w-full">Sync Now</Button>
                </CardContent>
            </Card>
        </div>
    )
}