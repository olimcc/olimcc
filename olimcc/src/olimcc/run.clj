(ns olimcc.run)

(use 'ring.adapter.jetty)
(use 'olimcc.core)

(defn -main []
  (run-jetty handler {:port 3000}))

