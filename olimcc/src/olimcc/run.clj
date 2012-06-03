(ns olimcc.run)

(use 'ring.adapter.jetty)
(use 'olimcc.core)

(defn -main []
  (run-jetty app {:port 3000}))

