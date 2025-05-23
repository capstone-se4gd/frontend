"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PrimaryButton } from "@/components/ui/primary-button"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Solita",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    language: "en-US",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    batchCompletionAlerts: true,
    weeklyReports: true,
    systemAlerts: true,
  })

  const handleSaveSettings = () => {
    alert("Settings saved successfully!")
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-gray-500 mt-1 text-md">Configure your sustainability management system</p>
      </div>

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">General Settings</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Basic configuration for your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                  aria-describedby="company-name-description"
                />
                <p id="company-name-description" className="mt-1 text-xs text-gray-500">
                  This name will appear throughout the application
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="CST">Central Time (CST)</option>
                    <option value="MST">Mountain Time (MST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                    <option value="CET">Central European Time (CET)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    id="dateFormat"
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MMM DD, YYYY">MMM DD, YYYY</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                >
                  <option value="en-US">English (UK)</option>
                  <option value="en-GB">Finnish</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Notification Settings</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Configure system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium text-sm">Email Notifications</h3>
                  <p className="text-xs text-gray-500">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.emailNotifications}
                    onChange={() =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: !notificationSettings.emailNotifications,
                      })
                    }
                    aria-label="Toggle email notifications"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#12b784]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#12b784]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium text-sm">Batch Completion Alerts</h3>
                  <p className="text-xs text-gray-500">Get notified when batches are completed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.batchCompletionAlerts}
                    onChange={() =>
                      setNotificationSettings({
                        ...notificationSettings,
                        batchCompletionAlerts: !notificationSettings.batchCompletionAlerts,
                      })
                    }
                    aria-label="Toggle batch completion alerts"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#12b784]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#12b784]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium text-sm">Weekly Reports</h3>
                  <p className="text-xs text-gray-500">Receive weekly summary reports</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.weeklyReports}
                    onChange={() =>
                      setNotificationSettings({
                        ...notificationSettings,
                        weeklyReports: !notificationSettings.weeklyReports,
                      })
                    }
                    aria-label="Toggle weekly reports"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#12b784]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#12b784]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium text-sm">System Alerts</h3>
                  <p className="text-xs text-gray-500">Get notified about system events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationSettings.systemAlerts}
                    onChange={() =>
                      setNotificationSettings({
                        ...notificationSettings,
                        systemAlerts: !notificationSettings.systemAlerts,
                      })
                    }
                    aria-label="Toggle system alerts"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#12b784]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#12b784]"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <PrimaryButton onClick={handleSaveSettings} size="large" className="text-md">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
