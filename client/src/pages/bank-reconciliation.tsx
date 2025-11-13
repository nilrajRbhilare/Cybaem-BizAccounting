import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function BankReconciliation() {
  const { bankTransactions, bookEntries, matchBankEntry } = useAppContext();
  const { toast } = useToast();

  const handleMatch = (bankId: string, bookId: string) => {
    const success = matchBankEntry(bankId, bookId);
    if (success) {
      toast({
        title: "Entries matched",
        description: "Bank transaction and book entry have been matched successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fadeInDown">
        <h1 className="text-2xl font-semibold mb-1">Bank Reconciliation</h1>
        <p className="text-muted-foreground">Match bank transactions with book entries</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-fadeInUp stagger-delay-1">
          <CardHeader>
            <CardTitle className="text-lg">Bank Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {bankTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No bank transactions to reconcile.
              </div>
            ) : (
              <div className="space-y-3">
                {bankTransactions.map((transaction) => (
                  <Card
                    key={transaction.id}
                    className={transaction.matched ? "opacity-50 border-success transition-smooth" : "hover-elevate hover-lift transition-smooth"}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant={transaction.type === "credit" ? "default" : "secondary"}>
                              {transaction.type}
                            </Badge>
                            {transaction.matched && (
                              <Badge className="bg-success hover:bg-success text-white">
                                <Check className="h-3 w-3 mr-1" />
                                Matched
                              </Badge>
                            )}
                          </div>
                          <div className="font-medium text-sm mb-1" data-testid={`bank-${transaction.id}`}>
                            {transaction.description}
                          </div>
                          <div className="text-xs text-muted-foreground">{transaction.date}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono font-semibold">
                            {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {!transaction.matched && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Match with book entry:</p>
                          <div className="flex flex-wrap gap-2">
                            {bookEntries
                              .filter(entry => !entry.matched && entry.amount === transaction.amount)
                              .map(entry => (
                                <Button
                                  key={entry.id}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMatch(transaction.id, entry.id)}
                                  data-testid={`match-${transaction.id}-${entry.id}`}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  {entry.id}
                                </Button>
                              ))}
                            {bookEntries.filter(entry => !entry.matched && entry.amount === transaction.amount).length === 0 && (
                              <span className="text-xs text-muted-foreground">No matching entries</span>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Book Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {bookEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No book entries to reconcile.
              </div>
            ) : (
              <div className="space-y-3">
                {bookEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    className={entry.matched ? "opacity-50 border-success" : "hover-elevate"}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant={entry.type === "income" ? "default" : "secondary"}>
                              {entry.type}
                            </Badge>
                            {entry.matched && (
                              <Badge className="bg-success hover:bg-success text-white">
                                <Check className="h-3 w-3 mr-1" />
                                Matched
                              </Badge>
                            )}
                          </div>
                          <div className="font-medium text-sm mb-1" data-testid={`book-${entry.id}`}>
                            {entry.description}
                          </div>
                          <div className="text-xs text-muted-foreground">{entry.date}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono font-semibold">
                            {entry.type === "income" ? "+" : "-"}₹{entry.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
