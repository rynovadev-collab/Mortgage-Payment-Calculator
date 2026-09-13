import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DollarSign, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RefundRequest {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_payment_intent_id: string;
  request_type: string;
  status: string;
  subscription_start_date: string;
  refund_amount: number;
  reason: string | null;
  admin_notes: string | null;
  processed_by: string | null;
  processed_at: string | null;
  created_at: string;
  profiles?: {
    username: string | null;
    email: string | null;
  };
}

export const RefundManagement = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data: requestsData, error } = await supabase
        .from('refund_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (requestsData && requestsData.length > 0) {
        const userIds = [...new Set(requestsData.map(req => req.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, username, email')
          .in('user_id', userIds);

        const profilesMap = new Map(
          profilesData?.map(p => [p.user_id, p]) || []
        );

        const requestsWithProfiles = requestsData.map(req => ({
          ...req,
          profiles: profilesMap.get(req.user_id)
        }));

        setRequests(requestsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching refund requests:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load refund requests",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDaysSinceSubscription = (subscriptionDate: string) => {
    const start = new Date(subscriptionDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const isWithinCoolingOffPeriod = (subscriptionDate: string) => {
    return getDaysSinceSubscription(subscriptionDate) <= 14;
  };

  const handleOpenDialog = (request: RefundRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setDialogAction(action);
    setAdminNotes(request.admin_notes || "");
    setDialogOpen(true);
  };

  const handleProcessRefund = async () => {
    if (!selectedRequest) return;

    setProcessingId(selectedRequest.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.functions.invoke('process-refund', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          requestId: selectedRequest.id,
          action: dialogAction,
          adminNotes,
        },
      });

      if (error) throw error;

      toast({
        title: dialogAction === 'approve' ? "Refund Processed" : "Request Rejected",
        description: dialogAction === 'approve' 
          ? `Successfully refunded £${data.amount}` 
          : "Refund request has been rejected",
      });

      setDialogOpen(false);
      setAdminNotes("");
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error('Process refund error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process refund",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'processed':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Processed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRequestTypeBadge = (type: string) => {
    return type === 'immediate' 
      ? <Badge variant="destructive">Immediate</Badge>
      : <Badge variant="outline">End of Period</Badge>;
  };

  if (loading) return <div>Loading refund requests...</div>;

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Refund Management</h2>
          <p className="text-muted-foreground">
            Process refund requests within 14-day cooling-off period
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-lg">
            {pendingRequests.length} Pending
          </Badge>
          <Badge variant="secondary" className="text-lg">
            {processedRequests.length} Processed
          </Badge>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Pending Requests</h3>
          {pendingRequests.map((request) => {
            const daysSince = getDaysSinceSubscription(request.subscription_start_date);
            const withinCoolingOff = isWithinCoolingOffPeriod(request.subscription_start_date);

            return (
              <Card key={request.id} className={withinCoolingOff ? "border-green-200" : "border-red-200"}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        £{request.refund_amount.toFixed(2)} Refund Request
                        {getRequestTypeBadge(request.request_type)}
                        {getStatusBadge(request.status)}
                      </CardTitle>
                      <CardDescription>
                        <div className="space-y-1">
                          <p><strong>User:</strong> {request.profiles?.username || request.profiles?.email || 'Unknown'}</p>
                          <p><strong>Subscription ID:</strong> {request.stripe_subscription_id}</p>
                          <p><strong>Subscription Start:</strong> {new Date(request.subscription_start_date).toLocaleDateString()}</p>
                          <p className="flex items-center gap-2">
                            <strong>Days Since Start:</strong> {daysSince} days
                            {withinCoolingOff ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Within Cooling-Off
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Outside Cooling-Off
                              </Badge>
                            )}
                          </p>
                          <p><strong>Requested:</strong> {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</p>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.reason && (
                    <div>
                      <Label>Cancellation Reason:</Label>
                      <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleOpenDialog(request, 'approve')}
                      disabled={!withinCoolingOff || processingId === request.id}
                      variant="default"
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Refund
                    </Button>
                    <Button
                      onClick={() => handleOpenDialog(request, 'reject')}
                      disabled={processingId === request.id}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                  {!withinCoolingOff && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <p className="text-xs text-red-700">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        Cannot approve: Subscription is {daysSince} days old (cooling-off period is 14 days)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Processed Requests</h3>
          {processedRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      £{request.refund_amount.toFixed(2)}
                      {getRequestTypeBadge(request.request_type)}
                      {getStatusBadge(request.status)}
                    </CardTitle>
                    <CardDescription>
                      <p><strong>User:</strong> {request.profiles?.username || request.profiles?.email || 'Unknown'}</p>
                      <p><strong>Processed:</strong> {request.processed_at ? formatDistanceToNow(new Date(request.processed_at), { addSuffix: true }) : 'N/A'}</p>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              {request.admin_notes && (
                <CardContent>
                  <Label>Admin Notes:</Label>
                  <p className="text-sm text-muted-foreground mt-1">{request.admin_notes}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {requests.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-muted-foreground">No refund requests found</p>
          </CardContent>
        </Card>
      )}

      {/* Processing Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Refund' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve'
                ? `Process refund of £${selectedRequest?.refund_amount.toFixed(2)} for this subscription?`
                : 'Reject this refund request?'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-notes">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                placeholder="Add notes about this decision..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleProcessRefund}
              variant={dialogAction === 'approve' ? 'default' : 'destructive'}
              disabled={processingId !== null}
            >
              {processingId ? 'Processing...' : dialogAction === 'approve' ? 'Approve & Process' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};