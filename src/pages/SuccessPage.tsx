import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdParam = urlParams.get('session_id');
    setSessionId(sessionIdParam);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Payment Successful!
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">
              Thank you for your purchase!
            </CardTitle>
            <CardDescription className="text-center">
              Your payment has been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessionId && (
              <Alert variant="success">
                <AlertDescription>
                  Order ID: {sessionId}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                You should receive a confirmation email shortly with your purchase details.
              </p>
              
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/">
                    Return to Home
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link to="/account">
                    View Account
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}