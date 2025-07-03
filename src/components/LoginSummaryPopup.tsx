
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Clock, Mail, BookOpen, Wrench, FileText, Video, X, User } from 'lucide-react';

interface LoginSummaryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardData: any;
  employeeName: string;
}

const LoginSummaryPopup: React.FC<LoginSummaryPopupProps> = ({ 
  isOpen, 
  onClose, 
  dashboardData, 
  employeeName 
}) => {
  const criticalCount = 
    dashboardData.incidents.filter((i: any) => i.severity === 'Critical').length +
    dashboardData.teamseMeetings.filter((m: any) => m.urgent).length +
    dashboardData.approvalRequests.urgent.length +
    dashboardData.serviceNowTickets.filter((t: any) => t.escalated).length +
    dashboardData.outlookMails.escalated.length +
    dashboardData.learning.filter((l: any) => l.mandatory && l.deadline === 'Today').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-xl">
            <div className="bg-blue-600 p-2 rounded-full">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>Daily Briefing - {employeeName}</span>
              <p className="text-sm text-gray-600 font-normal">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Critical Alert Summary */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-semibold text-red-800">Critical Items Requiring Immediate Attention</h3>
            <Badge variant="destructive" className="ml-auto">{criticalCount} Total</Badge>
          </div>
          <p className="text-sm text-red-700">
            You have {criticalCount} critical items that need your immediate attention today.
          </p>
        </div>

        {/* Grid Layout for Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Next Teams Meeting */}
          <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Video className="w-4 h-4 text-indigo-600 mr-2" />
                <h4 className="font-semibold text-indigo-800">Next Teams Meeting</h4>
              </div>
              {dashboardData.teamseMeetings.filter((m: any) => m.urgent).length > 0 && (
                <Badge variant="destructive" className="text-xs">Urgent</Badge>
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
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-800">Approval Requests</h4>
              </div>
              <Badge variant="destructive" className="text-xs">{dashboardData.approvalRequests.urgent.length} Urgent</Badge>
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
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                <h4 className="font-semibold text-red-800">Critical Incidents</h4>
              </div>
              <Badge variant="destructive" className="text-xs">
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
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 text-orange-600 mr-2" />
                <h4 className="font-semibold text-orange-800">Mandatory Training</h4>
              </div>
              <Badge variant="destructive" className="text-xs">
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
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Wrench className="w-4 h-4 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-800">ServiceNow Tickets</h4>
              </div>
              <Badge variant="destructive" className="text-xs">
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
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800">Urgent Emails</h4>
              </div>
              <Badge variant="destructive" className="text-xs">{dashboardData.outlookMails.escalated.length} Escalated</Badge>
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
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <Video className="w-4 h-4 mr-1" />
            Join Meeting
          </Button>
          <Button size="sm" variant="outline" className="border-blue-500 text-blue-600">
            <FileText className="w-4 h-4 mr-1" />
            Review Approvals
          </Button>
          <Button size="sm" variant="outline" className="border-red-500 text-red-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            View Incidents
          </Button>
          <Button size="sm" variant="outline" className="border-green-500 text-green-600">
            <Mail className="w-4 h-4 mr-1" />
            Check Emails
          </Button>
        </div>

        <div className="text-center mt-4">
          <Button variant="ghost" onClick={onClose} className="text-gray-600">
            Continue to Full Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginSummaryPopup;
