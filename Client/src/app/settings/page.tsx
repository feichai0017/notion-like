'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CloudIcon, LogIn, LogOut, Upload, User, Mail, Key, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type CloudService = 'onedrive' | 'gdrive' | 'dropbox'

interface CloudStorageState {
    isConnected: boolean
    email: string
    autoSync: boolean
}

interface UserInfo {
    name: string
    email: string
    avatar: string
}

export default function SettingsPage() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [cloudStorage, setCloudStorage] = useState<Record<CloudService, CloudStorageState>>({
        onedrive: { isConnected: false, email: '', autoSync: false },
        gdrive: { isConnected: true, email: 'user@example.com', autoSync: true },
        dropbox: { isConnected: false, email: '', autoSync: false },
    })
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://github.com/shadcn.png',
    })
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)

    const handleCloudLogin = (service: CloudService) => {
        setCloudStorage(prev => ({
            ...prev,
            [service]: { ...prev[service], isConnected: true, email: 'user@example.com' }
        }))
    }

    const handleCloudLogout = (service: CloudService) => {
        setCloudStorage(prev => ({
            ...prev,
            [service]: { isConnected: false, email: '', autoSync: false }
        }))
    }

    const toggleAutoSync = (service: CloudService) => {
        setCloudStorage(prev => ({
            ...prev,
            [service]: { ...prev[service], autoSync: !prev[service].autoSync }
        }))
    }

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            console.log(`Importing file: ${file.name}`)
        }
    }

    const handlePasswordChange = () => {
        if (newPassword === confirmPassword) {
            console.log('Password changed successfully')
            setShowPasswordDialog(false)
            // Here you would typically update the password in your backend
        } else {
            console.log('Passwords do not match')
        }
    }

    const handleDeleteAccount = () => {
        console.log('Account deleted')
        // Here you would typically delete the account in your backend and redirect to login page
    }

    const renderCloudServiceCard = (service: CloudService, title: string) => (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <CloudIcon className="mr-2 h-5 w-5" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {cloudStorage[service].isConnected ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Connected as: {cloudStorage[service].email}</span>
                            <Button variant="outline" size="sm" onClick={() => handleCloudLogout(service)}>
                                <LogOut className="mr-2 h-4 w-4" /> Disconnect
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor={`${service}-auto-sync`}>Auto Sync</Label>
                            <Switch
                                id={`${service}-auto-sync`}
                                checked={cloudStorage[service].autoSync}
                                onCheckedChange={() => toggleAutoSync(service)}
                            />
                        </div>
                    </div>
                ) : (
                    <Button onClick={() => handleCloudLogin(service)} size="sm" className="w-full">
                        <LogIn className="mr-2 h-4 w-4" /> Connect to {title}
                    </Button>
                )}
            </CardContent>
        </Card>
    )

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <h1 className="text-4xl font-bold mb-8">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                <div className="md:col-span-1 flex flex-col space-y-6">
                    <Card className="flex-grow">
                        <CardHeader>
                            <CardTitle className="text-2xl">User Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                                    <AvatarFallback>{userInfo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold">{userInfo.name}</h3>
                                    <p className="text-sm text-gray-500">{userInfo.email}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" value={userInfo.name} onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={userInfo.email} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} />
                            </div>
                            <Button className="w-full">Update Profile</Button>
                            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        <Key className="mr-2 h-4 w-4" /> Change Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Change Password</DialogTitle>
                                        <DialogDescription>
                                            Enter your new password and confirm it.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm Password</Label>
                                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handlePasswordChange}>Change Password</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteAccount}>Delete Account</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Import Document</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p>Import PDF or DOC files</p>
                                <Input id="file-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileImport} />
                                <Button className="w-full">
                                    <Upload className="mr-2 h-4 w-4" /> Import Document
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 flex flex-col space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Appearance</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                    <Card className="flex-grow">
                        <CardHeader>
                            <CardTitle className="text-2xl">Cloud Storage Sync</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {renderCloudServiceCard('onedrive', 'OneDrive')}
                            {renderCloudServiceCard('gdrive', 'Google Drive')}
                            {renderCloudServiceCard('dropbox', 'Dropbox')}
                            <Button className="w-full">Sync All Connected Services Now</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}