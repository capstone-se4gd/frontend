"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PrimaryButton } from "@/components/ui/primary-button"
import { OutlineButton } from "@/components/ui/outline-button"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Middleware",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    language: "en-US",
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    msIntegrationEnabled: true,
    apiKey: "••••••••••••••••",
    webhookUrl: "",
    syncFrequency: "daily",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    batchCompletionAlerts: true,
    weeklyReports: true,
    systemAlerts: true,
  })

  const [dataRetentionSettings, setDataRetentionSettings] = useState({
    retentionPeriod: "3years",
    automaticBackups: true,
    backupFrequency: "weekly",
  })

  const handleSaveSettings = () => {
    alert("Settings saved successfully!")
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure your sustainability management system</p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic configuration for your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                  <select
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MMM DD, YYYY">MMM DD, YYYY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
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

        <Card>
          <CardHeader>
            <CardTitle>Microsoft Sustainability Manager Integration</CardTitle>
            <CardDescription>Configure integration with Microsoft Sustainability Manager</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable Integration</h3>
                  <p className="text-sm text-gray-500">Connect with Microsoft Sustainability Manager</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={integrationSettings.msIntegrationEnabled}
                    onChange={() =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        msIntegrationEnabled: !integrationSettings.msIntegrationEnabled,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#12b784]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12b784]"></div>
                </label>
              </div>

              {integrationSettings.msIntegrationEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                    <div className="flex">
                      <input
                        type="password"
                        value={integrationSettings.apiKey}
                        onChange={(e) => setIntegrationSettings({ ...integrationSettings, apiKey: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                      />
                      <button className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200">
                        Show
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                    <input
                      type="text"
                      value={integrationSettings.webhookUrl}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, webhookUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sync Frequency</label>
                    <select
                      value={integrationSettings.syncFrequency}
                      onChange={(e) =>
                        setIntegrationSettings({ ...integrationSettings, syncFrequency: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                    >
                      <option value="realtime">Real-time</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <OutlineButton>Test Connection</OutlineButton>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
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
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#12b784]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12b784]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Batch Completion Alerts</h3>
                  <p className="text-sm text-gray-500">Get notified when batches are completed</p>
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
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#12b784]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12b784]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Weekly Reports</h3>
                  <p className="text-sm text-gray-500">Receive weekly summary reports</p>
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
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#12b784]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12b784]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">System Alerts</h3>
                  <p className="text-sm text-gray-500">Get notified about system events</p>
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
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#12b784]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12b784]"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
            <CardDescription>Configure data retention and backup policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention Period</label>
                <select
                  value={dataRetentionSettings.retentionPeriod}
                  onChange={(e) =>
                    setDataRetentionSettings({ ...dataRetentionSettings, retentionPeriod: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                >
                  <option value="1year">1 Year</option>
                  <option value="3years">3 Years</option>
                  <option value="5years">5 Years</option>
                  <option value="7years">7 Years</option>
                  <option value="indefinite">Indefinite</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Automatic Backups</h3>
                  <p className="text-sm text-gray-500">Enable automatic data backups</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={dataRetentionSettings.automaticBackups}
                    onChange={() =>
                      setDataRetentionSettings({
                        ...dataRetentionSettings,
                        automaticBackups: !dataRetentionSettings.automaticBackups,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#12b784]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12b784]"></div>
                </label>
              </div>

              {dataRetentionSettings.automaticBackups && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                  <select
                    value={dataRetentionSettings.backupFrequency}
                    onChange={(e) =>
                      setDataRetentionSettings({ ...dataRetentionSettings, backupFrequency: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#12b784] focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <PrimaryButton onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
