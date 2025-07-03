
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Clock, Mail, BookOpen, Wrench, FileText, Video, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DashboardSummaryProps {
  dashboardData: any;
  criticalCount: number;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ dashboardData, criticalCount }) => {
  const handleQuickAction = (action: string) => {
    toast({
      title: "Action Initiated",
      description: `${action} has been opened in a new window.`,
    });
  };

  return (
    <Card className="border-2 border-red-500 shadow-lg bg-white">
      <CardHeader className="bg-gradient-to-r from-red-600 to-black text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-3 text-xl">
          <div className="bg-white p-2 rounded-full">
            <User className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <span>Daily Dashboard Summary</span>
            <p className="text-sm text-gray-200 font-normal">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Critical Alert Summary */}
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-semibold text-red-800">Critical Items Requiring Immediate Attention</h3>
            <Badge variant="destructive" className="ml-auto bg-red-600 text-white">{criticalCount} Total</Badge>
          </div>
          <p className="text-sm text-red-700">
            You have {criticalCount} critical items that need your immediate attention today.
          </p>
        </div>

        {/* Grid Layout for Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

          {/* Next Teams Meeting */}
          <div className="border-2 border-indigo-300 rounded-lg p-4 bg-indigo-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Video className="w-4 h-4 text-indigo-600 mr-2" />
                <h4 className="font-semibold text-indigo-800">Next Teams Meeting</h4>
              </div>
              {dashboardData.teamseMeetings.filter((m: any) => m.urgent).length > 0 && (
                <Badge variant="destructive" className="text-xs bg-red-600 text-white">Urgent</Badge>
              )}
            </div>
            {dashboardData.teamseMeetings[0] && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{dashboardData.teamseMeetings[0].title}</p>
                <p className="text-xs text-gray-600">
                  {dashboardData.teamseMeetings[0].time} • {dashboardData.teamseMeetings[0].attendees} attendees
                </p>
                <p className="text-xs text-indigo-600">Channel: {dashboardData.teamseMeetings[0].channel}</p>
              </div>
            )}
          </div>

          {/* Urgent Approvals */}
          <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-800">Approval Requests</h4>
              </div>
              <Badge variant="destructive" className="text-xs bg-red-600 text-white">{dashboardData.approvalRequests.urgent.length} Urgent</Badge>
            </div>
            <div className="space-y-2">
              {dashboardData.approvalRequests.urgent.slice(0, 2).map((request: any) => (
                <div key={request.id} className="text-xs">
                  <p className="font-medium text-gray-900">{request.title}</p>
                  <p className="text-gray-600">{request.requester} • {request.days} days pending</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Incidents */}
          <div className="border-2 border-red-300 rounded-lg p-4 bg-red-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                <h4 className="font-semibold text-red-800">Critical Incidents</h4>
              </div>
              <Badge variant="destructive" className="text-xs bg-red-600 text-white">
                {dashboardData.incidents.filter((i: any) => i.severity === 'Critical').length} Critical
              </Badge>
            </div>
            <div className="space-y-2">
              {dashboardData.incidents.filter((i: any) => i.severity === 'Critical').slice(0, 2).map((incident: any) => (
                <div key={incident.id} className="text-xs">
                  <p className="font-medium text-gray-900">{incident.title}</p>
                  <p className="text-gray-600">Impact: {incident.impact} • {incident.duration}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Training */}
          <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 text-orange-600 mr-2" />
                <h4 className="font-semibold text-orange-800">Mandatory Training</h4>
              </div>
              <Badge variant="destructive" className="text-xs bg-red-600 text-white">
                {dashboardData.learning.filter((l: any) => l.deadline === 'Today').length} Due Today
              </Badge>
            </div>
            <div className="space-y-2">
              {dashboardData.learning.filter((l: any) => l.mandatory && l.deadline === 'Today').slice(0, 2).map((course: any) => (
                <div key={course.id} className="text-xs">
                  <p className="font-medium text-gray-900">{course.course}</p>
                  <p className="text-gray-600">Deadline: {course.deadline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Escalated ServiceNow Tickets */}
          <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Wrench className="w-4 h-4 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-800">ServiceNow Tickets</h4>
              </div>
              <Badge variant="destructive" className="text-xs bg-red-600 text-white">
                {dashboardData.serviceNowTickets.filter((t: any) => t.escalated).length} Escalated
              </Badge>
            </div>
            <div className="space-y-2">
              {dashboardData.serviceNowTickets.filter((t: any) => t.escalated).slice(0, 2).map((ticket: any) => (
                <div key={ticket.id} className="text-xs">
                  <p className="font-medium text-gray-900">{ticket.title}</p>
                  <p className="text-gray-600">{ticket.customer} • {ticket.priority} Priority</p>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Emails */}
          <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800">Urgent Emails</h4>
              </div>
              <Badge variant="destructive" className="text-xs bg-red-600 text-white">{dashboardData.outlookMails.escalated.length} Escalated</Badge>
            </div>
            <div className="space-y-2">
              {dashboardData.outlookMails.escalated.slice(0, 2).map((email: any) => (
                <div key={email.id} className="text-xs">
                  <p className="font-medium text-gray-900">{email.subject}</p>
                  <p className="text-gray-600">{email.sender} • {email.hoursAgo}h ago</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        <Separator className="my-4" />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleQuickAction('Teams Next Meeting')}>
            <Video className="w-4 h-4 mr-1" />
            Join Meeting
          </Button>
          <Button size="sm" variant="outline" className="border-black text-black hover:bg-black hover:text-white" onClick={() => handleQuickAction('All Approvals')}>
            <FileText className="w-4 h-4 mr-1" />
            Review Approvals
          </Button>
          <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white" onClick={() => handleQuickAction('Incident Management')}>
            <AlertTriangle className="w-4 h-4 mr-1" />
            View Incidents
          </Button>
          <Button size="sm" variant="outline" className="border-black text-black hover:bg-black hover:text-white" onClick={() => handleQuickAction('Outlook Web App')}>
            <Mail className="w-4 h-4 mr-1" />
            Check Emails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSummary;
