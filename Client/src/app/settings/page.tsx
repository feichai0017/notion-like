'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

const Logo = () => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="20" fill="#D5C3BB" />
        <path d="M15 25L22 32L35 19" stroke="#7D7168" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="mb-4 bg-[#F0EBE8] border-[#D5C3BB]">
                <CardHeader>
                    <CardTitle className="flex items-center text-xl text-[#7D7168]">
                        <CloudIcon className="mr-2 h-5 w-5" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {cloudStorage[service].isConnected ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[#7D7168]">Connected as: {cloudStorage[service].email}</span>
                                <Button variant="outline" size="sm" onClick={() => handleCloudLogout(service)} className="bg-[#E6E2DD] text-[#7D7168] hover:bg-[#D5C3BB]">
                                    <LogOut className="mr-2 h-4 w-4" /> Disconnect
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor={`${service}-auto-sync`} className="text-[#7D7168]">Auto Sync</Label>
                                <Switch
                                    id={`${service}-auto-sync`}
                                    checked={cloudStorage[service].autoSync}
                                    onCheckedChange={() => toggleAutoSync(service)}
                                />
                            </div>
                        </div>
                    ) : (
                        <Button onClick={() => handleCloudLogin(service)} size="sm" className="w-full bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD]">
                            <LogIn className="mr-2 h-4 w-4" /> Connect to {title}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )

    return (
        <div className="min-h-screen bg-[#E6E2DD] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center mb-12"
                >
                    <Logo />
                    <h1 className="text-5xl font-bold ml-4 text-[#7D7168]">Settings</h1>
                </motion.div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1 space-y-8"
                    >
                        <Card className="bg-[#F0EBE8] border-[#D5C3BB]">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#7D7168]">User Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                                        <AvatarFallback>{userInfo.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#7D7168]">{userInfo.name}</h3>
                                        <p className="text-sm text-[#9C8E85]">{userInfo.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-[#7D7168]">Username</Label>
                                    <Input id="username" value={userInfo.name} onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} className="bg-[#E6E2DD] border-[#D5C3BB] text-[#7D7168]" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[#7D7168]">Email</Label>
                                    <Input id="email" type="email" value={userInfo.email} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} className="bg-[#E6E2DD] border-[#D5C3BB] text-[#7D7168]" />
                                </div>
                                <Button className="w-full bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD]">Update Profile</Button>
                                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full bg-[#E6E2DD] text-[#7D7168] hover:bg-[#D5C3BB]">
                                            <Key className="mr-2 h-4 w-4" /> Change Password
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-[#F0EBE8]">
                                        <DialogHeader>
                                            <DialogTitle className="text-[#7D7168]">Change Password</DialogTitle>
                                            <DialogDescription className="text-[#9C8E85]">
                                                Enter your new password and confirm it.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password" className="text-[#7D7168]">New Password</Label>
                                                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-[#E6E2DD] border-[#D5C3BB] text-[#7D7168]" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password" className="text-[#7D7168]">Confirm Password</Label>
                                                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-[#E6E2DD] border-[#D5C3BB] text-[#7D7168]" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handlePasswordChange} className="bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD]">Change Password</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-full bg-[#C8B5AD] text-[#7D7168] hover:bg-[#B9A69E]">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-[#F0EBE8]">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-[#7D7168]">Are you sure you want to delete your account?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-[#9C8E85]">
                                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-[#E6E2DD] text-[#7D7168] hover:bg-[#D5C3BB]">Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-[#C8B5AD] text-[#7D7168] hover:bg-[#B9A69E]">Delete Account</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#F0EBE8] border-[#D5C3BB]">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#7D7168]">Import Document</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-[#9C8E85]">Import PDF or DOC files</p>
                                    <Input id="file-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileImport} className="bg-[#E6E2DD] border-[#D5C3BB] text-[#7D7168]" />
                                    <Button className="w-full bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD]">
                                        <Upload className="mr-2 h-4 w-4" /> Import Document
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <Card className="bg-[#F0EBE8] border-[#D5C3BB]">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#7D7168]">Appearance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="dark-mode" className="text-[#7D7168]">Dark Mode</Label>
                                    <Switch
                                        id="dark-mode"
                                        checked={isDarkMode}
                                        onCheckedChange={setIsDarkMode}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#F0EBE8] border-[#D5C3BB]">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#7D7168]">Cloud Storage Sync</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {renderCloudServiceCard('onedrive', 'OneDrive')}
                                {renderCloudServiceCard('gdrive', 'Google Drive')}
                                {renderCloudServiceCard('dropbox', 'Dropbox')}
                                <Button className="w-full bg-[#D5C3BB] text-[#7D7168] hover:bg-[#C8B5AD]">Sync All Connected Services Now</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}