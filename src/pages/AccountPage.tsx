import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, CreditCard, Package } from 'lucide-react';

export function AccountPage() {
  const { user, signOut } = useAuth();
  const { subscription, loading, error, activeProductName } = useSubscription();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Alert variant="destructive">
            <AlertDescription>
              Please sign in to view your account.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Dashboard</h1>
          <p className="text-gray-600">Manage your account and view your purchases</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Account Created</label>
                <p className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button onClick={signOut} variant="outline" className="w-full">
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Active Products
              </CardTitle>
              <CardDescription>
                Your current subscription and purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : activeProductName ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{activeProductName}</span>
                  </div>
                  {subscription?.subscription_status && (
                    <p className="text-sm text-gray-600 capitalize">
                      Status: {subscription.subscription_status.replace('_', ' ')}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No active products</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}